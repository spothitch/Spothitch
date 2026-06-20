const http = require('http')
const fs = require('fs')
const path = require('path')
const D = path.join(__dirname, '..', 'dist')
const M = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
}
http.createServer((q, r) => {
  try {
    let fp = path.join(D, q.url === '/' ? 'index.html' : q.url.split('?')[0])
    if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      const idx = path.join(fp, 'index.html')
      if (fs.existsSync(idx)) fp = idx
      else fp = path.join(D, 'index.html')
    }
    r.writeHead(200, { 'Content-Type': M[path.extname(fp)] || 'application/octet-stream' })
    r.end(fs.readFileSync(fp))
  } catch {
    r.writeHead(500)
    r.end('Error')
  }
}).listen(4173, () => console.log('Static server on http://localhost:4173'))
