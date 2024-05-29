const pool = require('../DataBase/database');
const bcrypt = require('bcrypt');

function checkEmailExists(email, callback) {
  const sql = 'SELECT id FROM user WHERE email = ?';
  pool.getConnection((err, connection) => {
    if (err) {
      return callback(err, null);
    }
    connection.query(sql, [email], (err, results) => {
      connection.release();
      if (err) {
        return callback(err, null);
      }
      callback(null, results.length > 0);
    });
  });
}

function createAccount(lastName,firstName, email, password, confirmPassword, res) {
  console.log(lastName);
console.log(firstName);
console.log(email);
console.log(password);
console.log(confirmPassword);

  if (password !== confirmPassword) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Passwords do not match' }));
  }

  checkEmailExists(email, (err, emailExists) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Server error' }));
    }
    if (emailExists) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Email already exists' }));
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Error hashing password' }));
      }
 console.log("i'm here");
      const sql = 'INSERT INTO user (firstName,lastName, email, password) VALUES (?, ?, ?, ?)';
      pool.getConnection((err, connection) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Server error' }));
        }
        connection.query(sql, [firstName,lastName, email, hashedPassword], (err, results) => {
          connection.release();
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Error creating account' }));
          }
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Account created successfully' }));
        });
      });
    });
  });
}

module.exports = { createAccount };