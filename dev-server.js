#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const PORT = 3000;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function clearPort() {
  return new Promise((resolve) => {
    log(`\n🧹 Checking port ${PORT}...`, 'cyan');
    
    exec(`lsof -ti:${PORT}`, (error, stdout) => {
      if (stdout) {
        const pids = stdout.trim().split('\n');
        log(`⚠️  Found process(es) on port ${PORT}: ${pids.join(', ')}`, 'yellow');
        
        pids.forEach(pid => {
          try {
            process.kill(pid, 'SIGTERM');
            log(`✅ Killed process ${pid}`, 'green');
          } catch (e) {
            log(`❌ Failed to kill process ${pid}: ${e.message}`, 'red');
          }
        });
        
        // Wait a moment for port to be released
        setTimeout(resolve, 1000);
      } else {
        log(`✅ Port ${PORT} is clear`, 'green');
        resolve();
      }
    });
  });
}

async function startDevServer() {
  // Clear the console
  console.clear();
  
  log(`
╔════════════════════════════════════════╗
║       TISB Development Server          ║
╚════════════════════════════════════════╝
`, 'bright');

  // Clear port if needed
  await clearPort();

  log(`\n🚀 Starting Vite development server...`, 'cyan');

  // Start Vite
  const vite = spawn('npm', ['run', 'dev'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  });

  let serverReady = false;

  // Handle stdout
  vite.stdout.on('data', (data) => {
    const output = data.toString();
    
    // Check if server is ready
    if (output.includes('Local:') && output.includes(`${PORT}`)) {
      serverReady = true;
      log(`\n✨ Server is ready!`, 'green');
      log(`\n📍 Access your site at:`, 'cyan');
      log(`   ${colors.bright}http://localhost:${PORT}${colors.reset}`);
      log(`\n📱 Key Pages:`, 'cyan');
      log(`   Home:    http://localhost:${PORT}/`);
      log(`   Blog:    http://localhost:${PORT}/blog`);
      log(`   Podcast: http://localhost:${PORT}/podcast`);
      log(`   Music:   http://localhost:${PORT}/music`);
      log(`\n💡 Tips:`, 'yellow');
      log(`   - Press Ctrl+C to stop the server`);
      log(`   - The server will auto-reload on file changes`);
      log(`   - Check the console for any errors\n`);
    }
    
    // Show output
    process.stdout.write(output);
  });

  // Handle stderr
  vite.stderr.on('data', (data) => {
    const error = data.toString();
    
    // Check for common errors
    if (error.includes('ERROR:')) {
      log(`\n❌ Error detected:`, 'red');
      console.error(error);
      
      if (error.includes('Expected ")"')) {
        log(`\n💡 Syntax error in TypeScript file. Check the line number above.`, 'yellow');
      }
    } else {
      process.stderr.write(error);
    }
  });

  // Handle exit
  vite.on('close', (code) => {
    if (code !== 0 && !serverReady) {
      log(`\n❌ Server failed to start (exit code ${code})`, 'red');
      log(`\n🔧 Troubleshooting tips:`, 'yellow');
      log(`   1. Run 'npm install' to ensure dependencies are installed`);
      log(`   2. Check for syntax errors in the console output above`);
      log(`   3. Try running './cleanup-dev.sh' to reset the environment`);
    }
    process.exit(code);
  });

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    log(`\n\n👋 Shutting down server...`, 'yellow');
    vite.kill('SIGTERM');
    setTimeout(() => {
      log(`✅ Server stopped`, 'green');
      process.exit(0);
    }, 100);
  });
}

// Run the server
startDevServer().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});