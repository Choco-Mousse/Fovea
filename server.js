const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url === '/' ? '/login.html' : req.url;
  let fullPath = path.join(__dirname, reqPath.split('?')[0]);

  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(fullPath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });
  fs.createReadStream(fullPath).pipe(res);
});

const srv = server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  👓 FOVEA - Smart Spects Finder Desktop Dashboard`);
  console.log(`  Live URL: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});

srv.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const backupPort = Number(PORT) + 1;
    console.warn(`[NOTICE] Port ${PORT} is occupied. Binding to port ${backupPort}...`);
    server.listen(backupPort, () => {
      console.log(`\n======================================================`);
      console.log(`  👓 FOVEA - Smart Spects Finder Desktop Dashboard`);
      console.log(`  Live URL: http://localhost:${backupPort}`);
      console.log(`======================================================\n`);
    });
  } else {
    console.error('Server error:', err);
  }
});
