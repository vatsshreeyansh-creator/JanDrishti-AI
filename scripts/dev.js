import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const args = process.argv.slice(2);

const startFrontend = !args.includes('--backend-only');
const startBackend = !args.includes('--frontend-only');

// Resolve Python executable
function getPythonExecutable() {
  const winVenv = path.join(rootDir, 'backend', 'venv', 'Scripts', 'python.exe');
  const posixVenv = path.join(rootDir, 'backend', 'venv', 'bin', 'python');

  if (fs.existsSync(winVenv)) return winVenv;
  if (fs.existsSync(posixVenv)) return posixVenv;
  return 'python';
}

const pythonBin = getPythonExecutable();
const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

console.log('\x1b[35m' + '='.repeat(64) + '\x1b[0m');
console.log('\x1b[1m\x1b[32m  JanDrishti AI — Local Development Unified Runner\x1b[0m');
console.log('\x1b[35m' + '='.repeat(64) + '\x1b[0m');
if (startBackend) console.log(`  \x1b[36m• Backend API:\x1b[0m   http://127.0.0.1:8000/api (FastAPI)`);
if (startBackend) console.log(`  \x1b[36m• Swagger Docs:\x1b[0m  http://127.0.0.1:8000/docs`);
if (startFrontend) console.log(`  \x1b[32m• Frontend App:\x1b[0m  http://localhost:5173 (React/Vite)`);
console.log(`  \x1b[33m• Python Engine:\x1b[0m ${pythonBin}`);
console.log('\x1b[35m' + '='.repeat(64) + '\x1b[0m\n');

const runningProcesses = [];

function killProcessTree(proc) {
  if (!proc || !proc.pid) return;
  try {
    if (isWindows) {
      execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
    } else {
      proc.kill('SIGTERM');
    }
  } catch {
    // Process already exited or cannot be killed
  }
}

function cleanupAndExit(code = 0) {
  for (const proc of runningProcesses) {
    killProcessTree(proc);
  }
  process.exit(code);
}

process.on('SIGINT', () => {
  console.log('\n\x1b[33m[runner] Shutting down JanDrishti services...\x1b[0m');
  cleanupAndExit(0);
});

process.on('SIGTERM', () => cleanupAndExit(0));
process.on('exit', () => cleanupAndExit(0));

function streamOutput(child, prefix, colorCode) {
  const formatChunk = (data) => {
    const lines = data.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim().length > 0) {
        process.stdout.write(`${colorCode}[${prefix}]\x1b[0m ${line}\n`);
      }
    }
  };

  child.stdout.on('data', formatChunk);
  child.stderr.on('data', formatChunk);
}

// Start Backend
if (startBackend) {
  const backendProc = spawn(
    pythonBin,
    [
      '-m',
      'uvicorn',
      '--app-dir',
      'backend',
      'main:app',
      '--reload',
      '--reload-dir',
      'backend',
      '--port',
      '8000',
      '--host',
      '127.0.0.1'
    ],
    {
      cwd: rootDir,
      stdio: ['inherit', 'pipe', 'pipe'],
      env: { ...process.env, PYTHONUNBUFFERED: '1' }
    }
  );

  runningProcesses.push(backendProc);
  streamOutput(backendProc, 'backend', '\x1b[36m');

  backendProc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\x1b[31m[backend] Process exited with code ${code}\x1b[0m`);
    }
  });
}

// Start Frontend
if (startFrontend) {
  const frontendArgs = fs.existsSync(viteBin)
    ? [viteBin]
    : ['vite'];
  const frontendCommand = fs.existsSync(viteBin)
    ? process.execPath
    : (isWindows ? 'npx.cmd' : 'npx');

  const frontendProc = spawn(
    frontendCommand,
    frontendArgs,
    {
      cwd: rootDir,
      stdio: ['inherit', 'pipe', 'pipe'],
      env: { ...process.env }
    }
  );

  runningProcesses.push(frontendProc);
  streamOutput(frontendProc, 'frontend', '\x1b[32m');

  frontendProc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\x1b[31m[frontend] Process exited with code ${code}\x1b[0m`);
    }
  });
}
