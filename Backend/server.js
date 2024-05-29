const http = require("http");
const mysql = require("mysql");
const url = require("url");
const fs = require("fs");
const path = require("path");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "data_bases",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected...");
});

const serveStaticFile = (res, filepath, contentType, responseCode = 200) => {
  fs.readFile(filepath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 - Internal Error");
    } else {
      res.writeHead(responseCode, { "Content-Type": contentType });
      res.end(data);
    }
  });
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === "/") {
    serveStaticFile(
      res,
      path.join(__dirname, "../frontend/index.html"),
      "text/html"
    );
  } else if (pathname === "/styles.css") {
    serveStaticFile(
      res,
      path.join(__dirname, "../frontend/styles.css"),
      "text/css"
    );
  } else if (pathname === "/script.js") {
    serveStaticFile(
      res,
      path.join(__dirname, "../frontend/script.js"),
      "application/javascript"
    );
  } else if (pathname === "/notes" && req.method === "GET") {
    const query = "SELECT * FROM notes";
    db.query(query, (err, results) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Database query failed" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Bunaaa`);
});
