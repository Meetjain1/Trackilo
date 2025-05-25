import { build } from 'esbuild';
import { obfuscate } from 'javascript-obfuscator';
import fs from 'fs';
import path from 'path';

const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  numbersToExpressions: true,
  simplify: true,
  stringArrayShuffle: true,
  splitStrings: true,
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

async function buildAndObfuscate() {
  // First, build the client
  console.log('Building client...');
  await build({
    entryPoints: ['client/src/index.js'],
    bundle: true,
    minify: true,
    outfile: 'client/build/bundle.js',
    loader: { '.js': 'jsx' },
    format: 'esm',
  });

  // Then obfuscate the bundle
  console.log('Obfuscating bundle...');
  const bundleContent = fs.readFileSync('client/build/bundle.js', 'utf8');
  const obfuscatedCode = obfuscate(bundleContent, obfuscationOptions).getObfuscatedCode();
  fs.writeFileSync('client/build/bundle.js', obfuscatedCode);

  console.log('Build and obfuscation complete!');
}

buildAndObfuscate().catch(console.error); 