const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  res.writeHead(200, { 'Content-Type': 'application/json' });

  if (pathname === '/static') {
    res.end(JSON.stringify({ header: 'Hello', body: 'Octagon NodeJS Test' }));
  } else if (pathname === '/dynamic') {
    const a = parseFloat(query.a);
    const b = parseFloat(query.b);
    const c = parseFloat(query.c);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      res.end(JSON.stringify({ header: 'Error' }));
    } else {
      const result = (a * b * c) / 3;
      res.end(JSON.stringify({ header: 'Calculated', body: result }));
    }
  } else {
    res.end(JSON.stringify({ header: 'Error', message: 'Unknown route' }));
  }
});


const port = 3000;
server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});