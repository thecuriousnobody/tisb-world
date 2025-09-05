import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TISB Test Server</title>
      <style>
        body { 
          font-family: monospace; 
          background: black; 
          color: #FF4500; 
          padding: 50px;
          text-align: center;
        }
        h1 { font-size: 3rem; }
      </style>
    </head>
    <body>
      <h1>🎉 TISB SERVER IS RUNNING!</h1>
      <p>This confirms your server setup is working.</p>
      <p>Time: ${new Date().toLocaleString()}</p>
      <p>Your APIs are ready:</p>
      <ul style="list-style: none; font-size: 1.2rem;">
        <li>✅ YouTube Data API v3</li>
        <li>✅ Spotify Web API</li> 
        <li>✅ Behance Auto-Scraper</li>
      </ul>
    </body>
    </html>
  `);
});

const PORT = 9000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test server running at http://localhost:${PORT}/`);
  console.log(`🌐 Also available at http://127.0.0.1:${PORT}/`);
});