const fs = require('fs');
const path = require('path');
const pool = require('../DataBase/database');

const handleIndexRequest = (req, res) => {
  const recommendedBooksQuery = 'SELECT * FROM book ORDER BY rating DESC LIMIT 10';
  const popularBooksQuery = 'SELECT * FROM book LIMIT 10';

  pool.getConnection((err, connection) => {
    if (err) {
        console.log("here1");
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');

      return;
    }

    connection.query(recommendedBooksQuery, [], (err, recommendedBooks) => {
      if (err) {
        connection.release();
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        console.log("here2");
        res.end('Internal Server Error');
        return;
      }

      connection.query(popularBooksQuery, [], (err, popularBooks) => {
        connection.release();
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          console.log("here3");
          res.end('Internal Server Error');
          return;
        }

        fs.readFile(path.join(__dirname, '../Frontend/Index-Page/index.html'), 'utf8', (err, html) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            console.log("here4");
            res.end('Internal Server Error');
            return;
          }

          let recommendedBooksHtml = '';
          let popularBooksHtml = '';

          recommendedBooks.forEach(book => {
            const base64Image = Buffer.from(book.cover, 'binary').toString('base64');
            const imageUrl = `data:image/jpeg;base64,${base64Image}`;
            recommendedBooksHtml += `
              <div class="carte">
                <img class="carti__poza" alt="${book.title}" src="${imageUrl}">
                <div class="carte__text">
                  <a href="#">${book.title}</a>
                  <a href="#">${book.author}</a>
                </div>
              </div>`;
          });

          popularBooks.forEach(book => {
            const base64Image = Buffer.from(book.cover, 'binary').toString('base64');
            const imageUrl = `data:image/jpeg;base64,${base64Image}`;
            popularBooksHtml += `
              <div class="carte">
                <img class="carti__poza" alt="${book.title}" src="${imageUrl}">
                <div class="carte__text">
                  <a href="#">${book.title}</a>
                  <a href="#">${book.author}</a>
                </div>
              </div>`;
          });

          html = html.replace('<!-- RECOMMENDED_BOOKS_PLACEHOLDER -->', recommendedBooksHtml);
          html = html.replace('<!-- POPULAR_BOOKS_PLACEHOLDER -->', popularBooksHtml);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(html);
        });
      });
    });
  });
};

module.exports = {handleIndexRequest,};
