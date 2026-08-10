import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const packagesDir = path.join(root, 'packages');
const releaseDir = path.join(root, 'release');

const packages = readdirSync(packagesDir).filter(
  (name) => name !== 'shared' && existsSync(path.join(packagesDir, name, 'wxt.config.ts')),
);

mkdirSync(releaseDir, { recursive: true });

let hadFailure = false;

for (const name of packages) {
  const pkgDir = path.join(packagesDir, name);
  console.log(`\n=== Building ${name} ===`);
  try {
    execSync('npx wxt build', { cwd: pkgDir, stdio: 'inherit' });
    execSync('npx wxt zip', { cwd: pkgDir, stdio: 'inherit' });

    const outputDir = path.join(pkgDir, '.output');
    const zipFile = readdirSync(outputDir).find((f) => f.endsWith('.zip'));
    if (zipFile) {
      const dest = path.join(releaseDir, `qeloma-${name}.zip`);
      copyFileSync(path.join(outputDir, zipFile), dest);
      console.log(`✔ ${name} → release/qeloma-${name}.zip`);
    } else {
      console.error(`✖ ${name}: no zip file produced`);
      hadFailure = true;
    }
  } catch (err) {
    console.error(`✖ ${name} failed:`, err.message);
    hadFailure = true;
  }
}

console.log(`\n${packages.length - (hadFailure ? 1 : 0)}/${packages.length} extensions packaged into ${releaseDir}`);
if (hadFailure) process.exit(1);
