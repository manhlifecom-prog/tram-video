#!/usr/bin/env node
// Read-only local setup checks. Never imports renderer/models or installs anything.
import {readFile, realpath, lstat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const EXPECTED = {'@remotion/bundler': '4.0.537', '@remotion/renderer': '4.0.537',
  react: '19.2.3', 'react-dom': '19.2.3', remotion: '4.0.537',
  '@types/react': '19.2.7', typescript: '5.9.3'};

export async function checkProject(root, options = {}) {
  root = await realpath(root);
  const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  if (pkg.name !== 'codex-video-captions' || pkg.version !== '0.3.0-beta.1') {
    throw Error('Wrong package identity/version; expected codex-video-captions 0.3.0-beta.1');
  }
  const declared = {...pkg.dependencies, ...pkg.devDependencies};
  if (Object.keys(declared).length !== Object.keys(EXPECTED).length ||
      Object.entries(EXPECTED).some(([name, version]) => declared[name] !== version)) {
    throw Error('Package must declare the exact seven reviewed dependency pins');
  }
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (!(major >= 24 || (major === 22 && minor >= 13) || (major === 20 && minor >= 19))) {
    throw Error('Unsupported Node; need ^20.19, ^22.13 or >=24');
  }
  const modules = path.join(root, 'node_modules');
  const ms = await lstat(modules).catch(() => null);
  if (!ms?.isDirectory() || ms.isSymbolicLink() || await realpath(modules) !== modules) {
    throw Error('Missing project-local node_modules or shared symlink. No ancestor dependency inheritance/install is allowed.');
  }
  const pins = {};
  for (const [name, expected] of Object.entries(EXPECTED)) {
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(expected)) {
      throw Error(`Dependency ${name} must use an exact version`);
    }
    const dir = path.join(modules, name);
    const resolved = await realpath(dir).catch(() => null);
    if (resolved !== dir || !(await lstat(dir)).isDirectory()) {
      throw Error(`Dependency ${name} must be an actual project-local directory, not a linked/ancestor package`);
    }
    const manifest = path.join(dir, 'package.json');
    if ((await lstat(manifest)).isSymbolicLink()) throw Error(`Linked manifest refused: ${name}`);
    const actual = JSON.parse(await readFile(manifest, 'utf8')).version;
    if (actual !== expected) throw Error(`Wrong ${name}: expected ${expected}, got ${actual}`);
    pins[name] = actual;
  }
  const optional = {};
  for (const [name, flag] of [['ffmpeg', '--ffmpeg'], ['browser', '--browser']]) {
    const supplied = options[name];
    if (!supplied) { optional[name] = 'not supplied; required before media work'; continue; }
    if (!path.isAbsolute(supplied)) throw Error(`${flag} needs an explicit absolute executable path`);
    const candidate = await realpath(supplied);
    if (!(await lstat(candidate)).isFile()) throw Error(`${name} executable missing`);
    // Version probes only, with an explicit path and bounded output/time. No browser launch/render.
    const args = name === 'ffmpeg' ? ['-version'] : ['--version'];
    const probe = spawnSync(candidate, args, {encoding: 'utf8', timeout: 5000, maxBuffer: 32768});
    if (probe.status !== 0 || probe.error) throw Error(`${name} version check failed`);
    optional[name] = (probe.stdout || probe.stderr).split('\n')[0];
  }
  return {status: 'local-setup-check-only', package: pkg.name, version: pkg.version,
    node: process.versions.node, project: root, pins, optional,
    limits: ['Dependency metadata/version presence, not a render or clean-machine proof',
      'Optional ASR/matte/listening not established; missing capability must stop its route',
      'No downloads/npm/models/providers/media work performed']};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), options = {};
  let root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (!['--project', '--ffmpeg', '--browser'].includes(key) || !args[i + 1]) {
      console.error('Usage: node scripts/check-environment.mjs [--project ABS] [--ffmpeg ABS] [--browser ABS]');
      process.exit(2);
    }
    const value = args[++i];
    if (key === '--project') root = path.resolve(value); else options[key.slice(2)] = value;
  }
  try { console.log(JSON.stringify(await checkProject(root, options), null, 2)); }
  catch (e) { console.error('Setup check stopped:', e.message); process.exitCode = 1; }
}
