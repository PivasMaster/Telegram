const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise');


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'ChatBotTests'
};

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  const method = req.method;

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const connection = await mysql.createConnection(dbConfig);

      if (pathname === '/getAllItems' && method === 'GET') {
          const [rows] = await connection.execute('SELECT * FROM Items');
          res.end(JSON.stringify(rows));

      } else if (pathname === '/addItem' && method === 'POST') {
          const { name, desc } = query;
          if (!name || !desc) {
              res.end(JSON.stringify(null));
              return;
          }
          await connection.execute('INSERT INTO Items (name, desc) VALUES (?, ?)', [name, desc]);
          res.end(JSON.stringify({id: connection.lastInsertId(), name, desc}));

      } else if (pathname === '/deleteItem' && method === 'POST') {
          const { id } = query;
          if (!id || isNaN(parseInt(id))) {
              res.end(JSON.stringify(null));
              return;
          }
          const [result] = await connection.execute('DELETE FROM Items WHERE id = ?', [id]);
          res.end(JSON.stringify(result.affectedRows > 0 ? {} : {}));

      } else if (pathname === '/updateItem' && method === 'POST') {
          const { id, name, desc } = query;
          if (!id || isNaN(parseInt(id)) || !name || !desc) {
              res.end(JSON.stringify(null));
              return;
          }
          const [result] = await connection.execute('UPDATE Items SET name = ?, desc = ? WHERE id = ?', [name, desc, id]);
          if (result.affectedRows === 0) {
              res.end(JSON.stringify({}));
          } else {
              const [[updatedItem]] = await connection.execute('SELECT * FROM Items WHERE id = ?', [id]);
              res.end(JSON.stringify(updatedItem));
          }

      } else {
          res.end(JSON.stringify({}));
      }
      connection.end();
    } catch (error) {
      console.error('Error:', error);
      res.end(JSON.stringify(null));
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
