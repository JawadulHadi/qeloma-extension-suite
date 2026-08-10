import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import { GoogleGenAI } from '@google/genai';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env['GEMINI_API_KEY'];
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required for Qeloma Lens AI analysis.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * REST API Endpoints for Qeloma Extension Suite
 */

// 1. Qeloma Lens AI Clip Analysis Endpoint
app.post('/api/lens-analyze', async (req, res) => {
  try {
    const { action, content, pageTitle, pageUrl } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required for Lens analysis.' });
      return;
    }

    const apiKey = process.env['GEMINI_API_KEY'];
    if (!apiKey) {
      // Graceful fallback response if no key is present in environment
      res.json({
        success: true,
        summary: `[Local Rule Engine] Analyzed content from ${pageTitle || 'Webpage'}:\n- Content length: ${content.length} characters.\n- Key focus: Tab management, UI elements, and productivity context.\n- AI Analysis Recommendation: Connect GEMINI_API_KEY for deep LLM insights.`,
        action,
        timestamp: new Date().toISOString(),
        isLocalFallback: true
      });
      return;
    }

    const ai = getAiClient();
    let prompt = '';
    if (action === 'summarize') {
      prompt = `You are Qeloma Lens, a browser extension AI assistant. Summarize the following web clipping concisely in 3 key bullet points with high readability:\n\nPage Title: ${pageTitle || 'N/A'}\nURL: ${pageUrl || 'N/A'}\nContent:\n${content}`;
    } else if (action === 'extract') {
      prompt = `You are Qeloma Lens AI. Extract key entities, action items, URLs, numbers, and key technical takeaways from this web clipping:\n\nContent:\n${content}`;
    } else if (action === 'verdict') {
      prompt = `You are Qeloma Lens Fact-Checker & Credibility Analyzer. Analyze the following web content snippet and provide a clear, objective analysis of the claims, technical accuracy, or sentiment:\n\nContent:\n${content}`;
    } else {
      prompt = `Analyze the following webpage content snippet for browser extension workflow:\n\n${content}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const resultText = response.text || 'No response generated.';
    res.json({
      success: true,
      summary: resultText,
      action,
      timestamp: new Date().toISOString(),
      isLocalFallback: false
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to process Lens AI request.';
    console.error('Error in /api/lens-analyze:', err);
    res.status(500).json({
      error: errorMsg,
      success: false
    });
  }
});

// 2. Chrome Web Store Manifest V3 Linter & Security Audit Endpoint
app.post('/api/validate-manifest', (req, res) => {
  try {
    const { manifest, checkLevel = 'strict', enforceMv3Strict = true } = req.body;
    if (!manifest) {
      res.status(400).json({ error: 'Manifest JSON is required' });
      return;
    }

    const parsed = typeof manifest === 'string' ? JSON.parse(manifest) : manifest;
    const issues: { level: 'error' | 'warning' | 'info'; field: string; message: string }[] = [];
    let permissionTier: 'Green' | 'Amber' | 'Red' = 'Green';
    let reviewTimeEstimate = '< 24 Hours (Automated Fast Track)';

    // Core MV3 Version Check
    if (parsed.manifest_version !== 3) {
      issues.push({
        level: 'error',
        field: 'manifest_version',
        message: 'Chrome Web Store requires Manifest V3. Version 2 is deprecated and rejected on upload.'
      });
    }

    const permissions: string[] = parsed.permissions || [];
    const hostPermissions: string[] = parsed.host_permissions || [];

    // Check Level 1: Strict Security & CSP Audit
    if (checkLevel === 'strict' || checkLevel === 'all') {
      if (hostPermissions.includes('<all_urls>') || hostPermissions.includes('*://*/*')) {
        permissionTier = 'Red';
        reviewTimeEstimate = '3 - 7 Days (Manual Security Review)';
        issues.push({
          level: enforceMv3Strict ? 'error' : 'warning',
          field: 'host_permissions',
          message: 'Broad host permission (<all_urls>) triggers mandatory human manual security review. Replace with activeTab or specific domain match patterns.'
        });
      }

      if (parsed.content_security_policy && JSON.stringify(parsed.content_security_policy).includes('unsafe-eval')) {
        issues.push({
          level: 'error',
          field: 'content_security_policy',
          message: "'unsafe-eval' is strictly forbidden under Manifest V3 CWS Policy 2.7 (No Remote Code Execution)."
        });
      }

      if (parsed.background && parsed.background.scripts) {
        issues.push({
          level: 'error',
          field: 'background',
          message: 'MV3 requires background service worker ("background.service_worker"), legacy "background.scripts" array is forbidden.'
        });
      }
    }

    // Check Level 2: Fast-Track & Review Velocity Audit
    if (checkLevel === 'fastTrack' || checkLevel === 'all' || checkLevel === 'strict') {
      if (permissions.includes('tabs') || permissions.includes('webRequest') || permissions.includes('cookies') || permissions.includes('scripting')) {
        if (permissionTier !== 'Red') permissionTier = 'Amber';
        reviewTimeEstimate = '1 - 2 Days (Standard Compliance Review)';
        issues.push({
          level: 'info',
          field: 'permissions',
          message: `Permission '${permissions.find(p => ['tabs', 'webRequest', 'cookies', 'scripting'].includes(p))}' adds manual compliance checks.`
        });
      }

      if (permissions.includes('activeTab') && !hostPermissions.length) {
        issues.push({
          level: 'info',
          field: 'permissions',
          message: 'Using activeTab without broad host permissions qualifies for CWS automated fast-track approval (<24h).'
        });
      }
    }

    // Check Level 3: Privacy & Data Usage Policy
    if (checkLevel === 'privacy' || checkLevel === 'all') {
      if (permissions.includes('cookies') || permissions.includes('webRequest')) {
        issues.push({
          level: 'warning',
          field: 'privacy_policy',
          message: 'Extension requests network/cookie access. You must provide a Privacy Policy URL disclosing data handling practices.'
        });
      }
      if (permissions.includes('storage')) {
        issues.push({
          level: 'info',
          field: 'storage',
          message: 'Uses chrome.storage API. Ensure data remains strictly local to user device.'
        });
      }
    }

    // Check Level 4: Single Purpose Policy (Rule 2.2)
    if (checkLevel === 'singlePurpose' || checkLevel === 'all') {
      if (!parsed.description || parsed.description.length < 10) {
        issues.push({
          level: 'warning',
          field: 'description',
          message: 'Description must clearly articulate the single focused utility of the extension (CWS Rule 2.2).'
        });
      }
      if (permissions.length > 6) {
        issues.push({
          level: 'warning',
          field: 'permissions',
          message: 'High permission count (>6) may indicate multiple unbundled features, risking Single Purpose Policy rejection.'
        });
      }
    }

    if (!parsed.action && !parsed.page_action && !parsed.browser_action) {
      issues.push({
        level: 'warning',
        field: 'action',
        message: 'No action popup or browser icon defined in manifest.'
      });
    }

    res.json({
      success: true,
      valid: issues.filter(i => i.level === 'error').length === 0,
      permissionTier,
      reviewTimeEstimate,
      issues,
      summary: `Analyzed Manifest for '${parsed.name || 'Extension'}'. Compliance Mode: ${checkLevel}. Tier: ${permissionTier}.`
    });
  } catch (err: unknown) {
    const detailsMsg = err instanceof Error ? err.message : 'Invalid JSON';
    res.status(400).json({ error: 'Invalid Manifest JSON syntax', details: detailsMsg });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
