interface CapturedSlice {
  dataUrl: string;
  scrollY: number;
}

interface FullPagePayload {
  slices: CapturedSlice[];
  viewportWidth: number;
  viewportHeight: number;
  totalHeight: number;
  devicePixelRatio: number;
}

async function getPageMetrics(tabId: number) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => ({
      scrollHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      originalScrollY: window.scrollY,
      devicePixelRatio: window.devicePixelRatio,
    }),
  });
  return result as {
    scrollHeight: number;
    viewportWidth: number;
    viewportHeight: number;
    originalScrollY: number;
    devicePixelRatio: number;
  };
}

async function scrollTo(tabId: number, y: number): Promise<void> {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: (scrollY: number) => {
      window.scrollTo(0, scrollY);
    },
    args: [y],
  });
  await new Promise((resolve) => setTimeout(resolve, 300));
}

async function captureFullPage(tabId: number, windowId: number): Promise<void> {
  const metrics = await getPageMetrics(tabId);
  const steps: number[] = [];
  let y = 0;
  while (y < metrics.scrollHeight - metrics.viewportHeight) {
    steps.push(y);
    y += metrics.viewportHeight;
  }
  steps.push(Math.max(0, metrics.scrollHeight - metrics.viewportHeight));

  const slices: CapturedSlice[] = [];
  for (const stepY of steps) {
    await scrollTo(tabId, stepY);
    const dataUrl = await chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
    slices.push({ dataUrl, scrollY: stepY });
  }

  await scrollTo(tabId, metrics.originalScrollY);

  const payload: FullPagePayload = {
    slices,
    viewportWidth: metrics.viewportWidth,
    viewportHeight: metrics.viewportHeight,
    totalHeight: metrics.scrollHeight,
    devicePixelRatio: metrics.devicePixelRatio,
  };
  await chrome.storage.session.set({ shot_fullpage_payload: payload });
  await chrome.tabs.create({ url: chrome.runtime.getURL('viewer.html?mode=fullpage') });
}

export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === 'CAPTURE_FULLPAGE' && typeof message.tabId === 'number' && typeof message.windowId === 'number') {
      captureFullPage(message.tabId, message.windowId).catch((err) => console.error('Qeloma Shot: full-page capture failed', err));
    }
  });
});
