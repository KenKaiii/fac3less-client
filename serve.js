#!/usr/bin/env node

const { exec } = require('child_process');
const net = require('net');

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
};

// Default ports to try
const PORTS_TO_TRY = [8080, 8081, 8082, 3000, 3001, 3002, 5000, 5001];

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', () => {
      resolve(false);
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

// Find an available port
async function findAvailablePort() {
  for (const port of PORTS_TO_TRY) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
  }
  
  // If no predefined ports are available, find a random one
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

// Clear console and show banner
function showBanner() {
  console.clear();
  console.log(`
${colors.cyan}${colors.bright}
    ███████╗ █████╗  ██████╗██████╗ ██╗     ███████╗███████╗███████╗
    ██╔════╝██╔══██╗██╔════╝╚════██╗██║     ██╔════╝██╔════╝██╔════╝
    █████╗  ███████║██║      █████╔╝██║     █████╗  ███████╗███████╗
    ██╔══╝  ██╔══██║██║      ╚═══██╗██║     ██╔══╝  ╚════██║╚════██║
    ██║     ██║  ██║╚██████╗██████╔╝███████╗███████╗███████║███████║
    ╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═════╝ ╚══════╝╚══════╝╚══════╝╚══════╝
${colors.reset}
    ${colors.magenta}By Ken Kai does AI${colors.reset}
    ${colors.dim}────────────────────────────────────────────────────────────────${colors.reset}
`);
}

// Show loading animation
function showLoading() {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\r    ${colors.yellow}${frames[i]} Starting your creative engine...${colors.reset}`);
    i = (i + 1) % frames.length;
  }, 80);
}

// Main function
async function main() {
  try {
    showBanner();
    const loadingInterval = showLoading();
    
    // Find port
    const port = await findAvailablePort();
    
    // Clear loading
    clearInterval(loadingInterval);
    process.stdout.write('\r' + ' '.repeat(50) + '\r');
    
    // Start server with minimal output
    const serverCmd = `npx http-server -p ${port} -c-1 --cors -g -d false -s`;
    const server = exec(serverCmd);
    
    // Show success message
    setTimeout(() => {
      console.log(`
    ${colors.green}${colors.bright}🚀 READY TO CREATE!${colors.reset}
    
    ${colors.bright}Your Fac3less studio is live at:${colors.reset}
    ${colors.cyan}${colors.bright}http://localhost:${port}${colors.reset}
    
    ${colors.dim}────────────────────────────────────────────────────────────────${colors.reset}
    
    ${colors.yellow}💡 Quick Start:${colors.reset}
    1. Your browser should open automatically
    2. Login with your account
    3. Add your API keys (OpenRouter & Replicate)
    4. Start creating amazing videos!
    
    ${colors.dim}Press Ctrl+C to stop${colors.reset}
`);
      
      // Open browser
      const openCmd = process.platform === 'darwin' ? 'open' : 
                      process.platform === 'win32' ? 'start' : 'xdg-open';
      exec(`${openCmd} http://localhost:${port}`);
    }, 1000);
    
    // Handle errors silently
    server.stdout.on('data', () => {}); // Suppress output
    server.stderr.on('data', () => {}); // Suppress errors
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log(`\n\n    ${colors.magenta}Thanks for using Fac3less! Keep creating awesome content! 🎬${colors.reset}\n`);
      server.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error(`\n    ${colors.red}❌ Oops! Something went wrong.${colors.reset}`);
    console.error(`    ${colors.dim}${error.message}${colors.reset}\n`);
    process.exit(1);
  }
}

main();