/* eslint-disable no-console */
/**
 * Builds the @biorate/hygen documentation site (site/) and copies the static
 * output into the monorepo root docs/hygen/ directory (committed, served by
 * GitHub Pages and/or the owner's own host).
 *
 * Cross-platform replacement for the shell one-liner that used `cd`, `&&`
 * and inline `node -e` (POSIX-only). Lives in the module's own `.scripts/`.
 * Run via the package script:
 *   pnpm run docs
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packageDir = path.resolve(__dirname, '..');
const siteDir = path.join(packageDir, 'site');
const buildDir = path.join(siteDir, 'build');
const destDir = path.join(packageDir, '..', '..', '..', 'docs', 'hygen');

function run(command, args, cwd) {
  const isWindows = process.platform === 'win32';
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: isWindows,
  });
  if (result.error || result.status !== 0) {
    console.error(`Command failed: ${command} ${args.join(' ')} (cwd: ${cwd})`);
    process.exit(result.status || 1);
  }
}

function pnpm(args, cwd) {
  // Resolve pnpm.cmd on Windows; plain `pnpm` elsewhere.
  run(isWindows() ? 'pnpm.cmd' : 'pnpm', args, cwd);
}

function isWindows() {
  return process.platform === 'win32';
}

function main() {
  if (!fs.existsSync(siteDir)) {
    console.error(`Site directory not found: ${siteDir}`);
    process.exit(1);
  }

  pnpm(['install', '--ignore-workspace'], siteDir);
  pnpm(['build'], siteDir);
  if (!fs.existsSync(buildDir)) {
    console.error(`Build output not found: ${buildDir}`);
    process.exit(1);
  }

  fs.rmSync(destDir, { recursive: true, force: true });
  fs.cpSync(buildDir, destDir, { recursive: true });
  console.log(`Docs copied: ${buildDir} -> ${destDir}`);
}

main();
