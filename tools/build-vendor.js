#!/usr/bin/env node
/**
 * Bundle third-party dependencies into app/vendor/ for offline use.
 * Runs esbuild to create ESM bundles.
 * 
 * Usage: npm run build:vendor
 */

import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const VENDOR_DIR = join(ROOT, 'app', 'vendor');

// Ensure vendor directory exists
if (!existsSync(VENDOR_DIR)) {
  mkdirSync(VENDOR_DIR, { recursive: true });
}

// KaTeX needs its CSS and fonts copied
function copyKatexAssets() {
  const katexSrc = join(ROOT, 'node_modules', 'katex');
  const katexDst = join(VENDOR_DIR, 'katex');
  
  // Copy CSS
  const cssDir = join(katexDst, 'dist');
  if (!existsSync(cssDir)) mkdirSync(cssDir, { recursive: true });
  copyFileSync(
    join(katexSrc, 'dist', 'katex.min.css'),
    join(cssDir, 'katex.min.css')
  );
  
  // Copy fonts
  const fontsSrc = join(katexSrc, 'dist', 'fonts');
  const fontsDst = join(cssDir, 'fonts');
  if (existsSync(fontsSrc)) {
    if (!existsSync(fontsDst)) mkdirSync(fontsDst, { recursive: true });
    for (const font of readdirSync(fontsSrc)) {
      copyFileSync(join(fontsSrc, font), join(fontsDst, font));
    }
  }
  
  // Also copy contrib/auto-render
  const contribSrc = join(katexSrc, 'dist', 'contrib');
  const contribDst = join(cssDir, 'contrib');
  if (!existsSync(contribDst)) mkdirSync(contribDst, { recursive: true });
  copyFileSync(
    join(contribSrc, 'auto-render.min.js'),
    join(contribDst, 'auto-render.min.js')
  );
}

// Bundle each dependency with esbuild
async function buildVendor() {
  const bundles = [
    { entry: 'marked', outfile: 'marked.js' },
    { entry: 'js-yaml', outfile: 'js-yaml.js' },
    { entry: 'cytoscape', outfile: 'cytoscape.js' },
    { entry: 'katex', outfile: 'katex.js' },
  ];

  for (const spec of bundles) {
    console.log(`Bundling ${spec.entry} -> ${spec.outfile}`);
    await esbuild.build({
      entryPoints: [spec.entry],
      bundle: true,
      minify: false,
      format: 'esm',
      outfile: join(VENDOR_DIR, spec.outfile),
      platform: 'browser',
      target: ['es2020'],
    });
  }
  
  // Copy KaTeX static assets after bundle
  copyKatexAssets();
  
  console.log('Vendor bundles created in app/vendor/');
}

buildVendor().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});