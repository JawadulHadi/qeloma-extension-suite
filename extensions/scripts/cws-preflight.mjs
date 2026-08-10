/**
 * Chrome Web Store pre-flight.
 *
 * Gate every extension before it is uploaded. Checks the built output in
 * packages/<name>/.output/chrome-mv3 (byte-identical to what `wxt zip` archives)
 * plus the release zip itself.
 *
 * Rules encode the things CWS either rejects outright or flags into slow manual
 * review. ERRORs must be fixed before upload. WARNs are things a reviewer will
 * ask about — each needs an answer ready in the dashboard justification fields.
 *
 *   node scripts/cws-preflight.mjs            # all packages
 *   node scripts/cws-preflight.mjs night shot # a subset
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const packagesDir = path.join(root, 'packages');
const releaseDir = path.join(root, 'release');

// Manifest limits straight from the Chrome extension docs.
const MAX_NAME = 75;
const MAX_SHORT_NAME = 12;
const MAX_DESCRIPTION = 132;
const REQUIRED_ICONS = [16, 48, 128];

// Permissions that push a submission out of automated review and into a human
// one. Not errors — but every one needs a written justification at upload time.
const BROAD_PERMISSIONS = new Set([
  'tabs',
  'webRequest',
  'webRequestBlocking',
  'cookies',
  'history',
  'bookmarks',
  'management',
  'nativeMessaging',
  'debugger',
  'proxy',
  'downloads',
  'tabCapture',
  'desktopCapture',
  'clipboardRead',
  'geolocation',
  'privacy',
]);

const BROAD_MATCH = /^(<all_urls>|\*:\/\/\*\/\*|https?:\/\/\*\/\*)$/;

function walk(dir, base = dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}

/** CWS accepts 1–4 dot-separated integers, 0–65535, no leading zeros. */
function versionProblem(version) {
  if (typeof version !== 'string') return 'version is missing';
  const parts = version.split('.');
  if (parts.length < 1 || parts.length > 4) return `"${version}" must have 1–4 parts`;
  for (const p of parts) {
    if (!/^\d+$/.test(p)) return `"${version}" part "${p}" is not an integer`;
    if (p.length > 1 && p.startsWith('0')) return `"${version}" part "${p}" has a leading zero`;
    if (Number(p) > 65535) return `"${version}" part "${p}" exceeds 65535`;
  }
  return null;
}

function checkPackage(name) {
  const errors = [];
  const warnings = [];
  const notes = [];

  const outDir = path.join(packagesDir, name, '.output', 'chrome-mv3');
  if (!existsSync(outDir)) {
    return { name, errors: [`no build output at ${path.relative(root, outDir)} — run build:all first`], warnings, notes };
  }

  const files = walk(outDir);
  const manifestPath = path.join(outDir, 'manifest.json');
  if (!existsSync(manifestPath)) {
    return { name, errors: ['manifest.json missing from build output'], warnings, notes };
  }

  let m;
  try {
    m = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    return { name, errors: [`manifest.json is not valid JSON: ${err.message}`], warnings, notes };
  }

  // ---- manifest basics -----------------------------------------------------
  if (m.manifest_version !== 3) errors.push(`manifest_version is ${m.manifest_version}, must be 3`);

  if (!m.name) errors.push('name is missing');
  else if (m.name.length > MAX_NAME) errors.push(`name is ${m.name.length} chars, max ${MAX_NAME}`);

  if (m.short_name && m.short_name.length > MAX_SHORT_NAME) {
    warnings.push(`short_name is ${m.short_name.length} chars; Chrome truncates past ~${MAX_SHORT_NAME}`);
  }

  if (!m.description) errors.push('description is missing (CWS requires one)');
  else if (m.description.length > MAX_DESCRIPTION) {
    errors.push(`description is ${m.description.length} chars, max ${MAX_DESCRIPTION}`);
  }

  const vp = versionProblem(m.version);
  if (vp) errors.push(`invalid version — ${vp}`);

  // Dev-only manifest keys that make an upload fail.
  if (m.key) errors.push('manifest contains "key" — remove it before uploading');
  if (m.update_url) errors.push('manifest contains "update_url" — not allowed for CWS uploads');

  // ---- icons ---------------------------------------------------------------
  for (const size of REQUIRED_ICONS) {
    const rel = m.icons?.[size] ?? m.icons?.[String(size)];
    if (!rel) {
      errors.push(`icons.${size} not declared`);
      continue;
    }
    const iconPath = path.join(outDir, rel);
    if (!existsSync(iconPath)) {
      errors.push(`icons.${size} points at "${rel}" which is not in the build output`);
      continue;
    }
    try {
      const png = PNG.sync.read(readFileSync(iconPath));
      if (png.width !== size || png.height !== size) {
        errors.push(`icons.${size} ("${rel}") is ${png.width}x${png.height}, must be ${size}x${size}`);
      }
    } catch {
      errors.push(`icons.${size} ("${rel}") is not a readable PNG`);
    }
  }
  if (!m.action?.default_icon) warnings.push('action.default_icon not set — the toolbar falls back to a greyed icon');

  // ---- permissions ---------------------------------------------------------
  const permissions = m.permissions ?? [];
  const hostPermissions = m.host_permissions ?? [];

  for (const p of permissions) {
    if (BROAD_PERMISSIONS.has(p)) warnings.push(`permission "${p}" needs a written justification at upload`);
  }
  for (const h of hostPermissions) {
    if (BROAD_MATCH.test(h)) warnings.push(`host_permission "${h}" is broad — expect manual review`);
  }
  for (const cs of m.content_scripts ?? []) {
    for (const match of cs.matches ?? []) {
      if (BROAD_MATCH.test(match)) {
        warnings.push(`content script matches "${match}" — broad host access, expect manual review`);
      }
    }
  }

  // ---- declarativeNetRequest correctness -----------------------------------
  // A redirect to an extension page only works if the page is web-accessible AND
  // the extension holds host permissions for the request URL. Missing either one
  // fails silently at runtime: the rule is registered, the redirect never fires.
  if (permissions.includes('declarativeNetRequest') || permissions.includes('declarativeNetRequestWithHostAccess')) {
    const jsFiles = files.filter((f) => f.endsWith('.js'));
    const usesExtensionPathRedirect = jsFiles.some((f) => {
      const src = readFileSync(path.join(outDir, f), 'utf8');
      return src.includes('extensionPath') || /type:\s*["']redirect["']/.test(src);
    });

    if (usesExtensionPathRedirect) {
      const warResources = (m.web_accessible_resources ?? []).flatMap((r) => r.resources ?? []);
      const htmlTargets = files.filter((f) => f.endsWith('.html'));
      const anyHtmlExposed = htmlTargets.some((h) => warResources.includes(h) || warResources.includes(`/${h}`));

      if (!anyHtmlExposed) {
        errors.push(
          'declarativeNetRequest redirects to an extension page, but no web_accessible_resources entry exposes it — ' +
            'the redirect will not fire',
        );
      }
      const optionalHosts = m.optional_host_permissions ?? [];
      if (hostPermissions.length === 0 && optionalHosts.length === 0) {
        errors.push(
          'declarativeNetRequest redirect action requires host permissions for the request URL; ' +
            'neither host_permissions nor optional_host_permissions is declared — ' +
            'the rule will be registered but never applied',
        );
      } else if (hostPermissions.length === 0) {
        notes.push(
          'host access is optional and requested per domain — runtime must fall back to a block rule when it is declined',
        );
      }
    }
  }

  // ---- remote code ---------------------------------------------------------
  // CWS bans executing code that is not in the package.
  for (const f of files.filter((x) => x.endsWith('.js'))) {
    const src = readFileSync(path.join(outDir, f), 'utf8');
    if (/\beval\s*\(/.test(src)) errors.push(`${f} calls eval() — remote/dynamic code execution is banned`);
    if (/new\s+Function\s*\(/.test(src)) errors.push(`${f} uses new Function() — remote/dynamic code execution is banned`);
    if (/import\s*\(\s*["'`]https?:/.test(src)) errors.push(`${f} dynamically imports a remote module`);
  }
  for (const f of files.filter((x) => x.endsWith('.html'))) {
    const src = readFileSync(path.join(outDir, f), 'utf8');
    if (/<script[^>]+src=["']https?:/i.test(src)) errors.push(`${f} loads a remote <script> — must be bundled`);
    if (/<link[^>]+href=["']https?:/i.test(src)) warnings.push(`${f} loads a remote stylesheet or font — bundle it`);
  }

  // ---- package hygiene -----------------------------------------------------
  const junk = files.filter(
    (f) => f.endsWith('.map') || f.endsWith('.DS_Store') || f === '.env' || f.startsWith('node_modules/'),
  );
  for (const j of junk) errors.push(`build output contains "${j}" — must not ship`);

  // ---- release zip ---------------------------------------------------------
  const zipPath = path.join(releaseDir, `qeloma-${name}.zip`);
  if (!existsSync(zipPath)) {
    errors.push(`release/qeloma-${name}.zip is missing — run build:all`);
  } else {
    const bytes = statSync(zipPath).size;
    if (bytes === 0) errors.push(`release/qeloma-${name}.zip is empty`);
    notes.push(`zip ${(bytes / 1024).toFixed(1)} KB · ${files.length} files · v${m.version}`);
  }

  const perms = [...permissions, ...hostPermissions];
  notes.push(`permissions: ${perms.length ? perms.join(', ') : '(none)'}`);

  return { name, errors, warnings, notes };
}

// ---- run ------------------------------------------------------------------
const requested = process.argv.slice(2);
const allPackages = readdirSync(packagesDir).filter(
  (n) => n !== 'shared' && existsSync(path.join(packagesDir, n, 'wxt.config.ts')),
);
const targets = requested.length ? allPackages.filter((n) => requested.includes(n)) : allPackages;

if (!targets.length) {
  console.error(`No matching packages. Available: ${allPackages.join(', ')}`);
  process.exit(1);
}

let totalErrors = 0;
let totalWarnings = 0;

for (const name of targets) {
  const { errors, warnings, notes } = checkPackage(name);
  totalErrors += errors.length;
  totalWarnings += warnings.length;

  const status = errors.length ? 'FAIL' : warnings.length ? 'WARN' : 'PASS';
  console.log(`\n${status}  ${name}`);
  for (const n of notes) console.log(`      · ${n}`);
  for (const e of errors) console.log(`  ERROR ${e}`);
  for (const w of warnings) console.log(`   warn ${w}`);
}

console.log(
  `\n${targets.length} extension(s) checked — ${totalErrors} error(s), ${totalWarnings} warning(s) needing justification text.`,
);
if (totalErrors) {
  console.log('Fix every ERROR before uploading. Warnings are review questions, not blockers.');
  process.exit(1);
}
