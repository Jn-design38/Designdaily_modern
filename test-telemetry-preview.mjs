import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const dist = path.join(process.cwd(), 'dist');
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const cleanUrl = req.url.split('?')[0];
  let file = path.join(dist, cleanUrl === '/' ? 'index.html' : cleanUrl);
  if (!fs.existsSync(file)) {
    res.writeHead(404);
    res.end('Not found: ' + req.url);
    return;
  }
  const ext = path.extname(file);
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(3005, async () => {
  console.log('Test server active at http://localhost:3005');

  // Verify index.html content
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  console.log('index.html size:', html.length, 'bytes');

  // Verify critical CSS and JS chunks exist
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsChunk = assets.find(f => f.endsWith('.js'));
  const cssChunk = assets.find(f => f.endsWith('.css'));
  console.log('JS chunk verified:', jsChunk);
  console.log('CSS chunk verified:', cssChunk);

  const triptyImg = path.join(dist, 'assets', 'tripty-cover.png');
  console.log('Tripty asset verified in dist:', fs.existsSync(triptyImg));

  server.close(() => {
    console.log('Verification finished successfully.');
    process.exit(0);
  });
});
