const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Mantis Services (Frontend & Backend)...');

// 1. Start Backend FastAPI Server
const backend = spawn('venv\\Scripts\\python.exe', ['-m', 'uvicorn', 'main:app', '--reload', '--port', '8000'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true,
  stdio: 'inherit'
});

// 2. Start Frontend Next.js Server
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true,
  stdio: 'inherit'
});

// Handle termination cleanly
const cleanup = () => {
  console.log('\nStopping all services...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
