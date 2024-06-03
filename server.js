const http = require('http');
const path = require('path');
const fs = require('fs');
const initializeDatabase = require('./DataBase/databasemaker');
const { handleCreateAccountRequest, handleCreateAccountSubmit } = require('./Backend/createAccount');
const { handleLoginRequest,handleLoginSubmission} = require('./Backend/login');
const {handleIndexRequest}=require('./Backend/index');
//initializeDatabase();


const server = http.createServer((req, res) => {
  // Verifică cererile pentru pagina de creare a contului
  if (req.method === 'GET' && req.url === '/create-account') {
    handleCreateAccountRequest(req, res);
  } else if (req.method === 'POST' && req.url === '/create-account') {
    handleCreateAccountSubmit(req, res);
  } 
  else if (req.method === 'GET' && req.url === '/login') {
    handleLoginRequest(req, res);
   } else if (req.method === 'POST' && req.url === '/login') {
     handleLoginSubmission(req, res);
   } 
   else if (req.method === 'GET' && req.url === '/') {
    handleIndexRequest(req, res);
  } 
  // Verifică cererile pentru fișiere CSS
  else if (req.url.startsWith('/style/')) {
    const filePath = path.join(__dirname, 'Frontend/Register-Page', req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  } 
   // Verifică cererile pentru fișierul index.js
   else if (req.url === '/Frontend/Index-Page/index.js') {
    const filePath = path.join(__dirname, 'Frontend/Index-Page', 'index.js');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });
  } 
  // Verifică cererile pentru alte fișiere statice (HTML, JS, imagini)
  else if (req.url.startsWith('/Frontend/')) {
    const filePath = path.join(__dirname, req.url);
    const extname = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';

        switch (extname) {
            case '.js':
                contentType = 'application/javascript'
                break
            case '.css':
                contentType = 'text/css'
                break
            case '.json':
                contentType = 'application/json'
                break
            case '.png':
                contentType = 'image/png'
                break
            case '.jpg':
                contentType = 'image/jpg'
                break
            case '.gif':
                contentType = 'image/gif'
                break
            case '.svg':
                contentType = 'image/svg+xml'
                break
            default:
                contentType = 'text/html'
                break
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404)
                    res.end('404 Not Found')
                } else {
                    console.log('server')
                    res.writeHead(500)
                    res.end('Internal Server Error')
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(content, 'utf-8')
            }
        })
    } else {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end('Not Found')
    }
})

server.listen(3000, () => {
    console.log('Server is listening on port 3000')
})
