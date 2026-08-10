export const GEMINI_API_KEY_STORAGE = 'clip_lens_gemini_api_key';

export type LensAction = 'summarize' | 'extract' | 'verdict';

const ACTION_INSTRUCTIONS: Record<LensAction, string> = {
  summarize: 'Summarize the following page excerpt in 3-4 concise sentences.',
  extract: 'Extract the key facts and takeaways from the following page excerpt as a short bullet list.',
  verdict: 'Read the following page excerpt and give a short verdict on its overall tone and credibility, with one sentence of reasoning.',
};

function buildPrompt(action: LensAction, content: string, pageTitle: string, pageUrl: string): string {
  return `${ACTION_INSTRUCTIONS[action]}\n\nPage title: ${pageTitle}\nPage URL: ${pageUrl}\n\nExcerpt:\n"""\n${content.slice(0, 6000)}\n"""`;
}

export async function streamGeminiAnalysis(
  apiKey: string,
  action: LensAction,
  content: string,
  pageTitle: string,
  pageUrl: string,
  onChunk: (textSoFar: string) => void,
): Promise<string> {
  const prompt = buildPrompt(action, content, pageTitle, pageUrl);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  );

  if (!response.ok || !response.body) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const jsonStr = line.slice(6).trim();
      if (!jsonStr || jsonStr === '[DONE]') continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const piece = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (piece) {
          fullText += piece;
          onChunk(fullText);
        }
      } catch {
        // ignore partial/malformed SSE chunks
      }
    }
  }

  return fullText;
}

const STOPWORDS = new Set(
  'the a an and or but of to in on for with is are was were be been being this that these those it its as at by from into about over under above below than then so if not no yes we you they he she i'.split(
    ' ',
  ),
);

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}

function scoreSentences(sentences: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const sentence of sentences) {
    for (const word of sentence.toLowerCase().match(/[a-z']+/g) ?? []) {
      if (STOPWORDS.has(word)) continue;
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }
  }
  const scores = new Map<string, number>();
  for (const sentence of sentences) {
    const words = sentence.toLowerCase().match(/[a-z']+/g) ?? [];
    const score = words.reduce((sum, w) => sum + (freq.get(w) ?? 0), 0) / Math.max(words.length, 1);
    scores.set(sentence, score);
  }
  return scores;
}

const POSITIVE_WORDS = ['great', 'excellent', 'good', 'positive', 'benefit', 'improve', 'success', 'effective', 'strong', 'innovative'];
const NEGATIVE_WORDS = ['bad', 'poor', 'negative', 'risk', 'fail', 'problem', 'concern', 'weak', 'decline', 'issue'];

export function localFallbackAnalysis(action: LensAction, content: string): string {
  const sentences = splitSentences(content);
  if (sentences.length === 0) return 'Not enough text was selected to analyze.';

  const scores = scoreSentences(sentences);
  const ranked = [...sentences].sort((a, b) => (scores.get(b) ?? 0) - (scores.get(a) ?? 0));

  if (action === 'summarize') {
    return ranked.slice(0, 3).join(' ');
  }

  if (action === 'extract') {
    return ranked
      .slice(0, 5)
      .map((s) => `• ${s}`)
      .join('\n');
  }

  const lower = content.toLowerCase();
  const positiveHits = POSITIVE_WORDS.filter((w) => lower.includes(w)).length;
  const negativeHits = NEGATIVE_WORDS.filter((w) => lower.includes(w)).length;
  const tone = positiveHits > negativeHits ? 'leans positive' : negativeHits > positiveHits ? 'leans negative' : 'reads as neutral';
  return `This excerpt ${tone} in tone (${positiveHits} positive vs ${negativeHits} negative signal words). ${ranked[0] ?? ''}`;
}
