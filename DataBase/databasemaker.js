const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'data_base',
})

function initializeDatabase() {
    connection.connect((err) => {
        if (err) {
            console.error('Eroare la conectarea la baza de date:', err)
            throw err
        }
        console.log('Conectat cu succes la baza de date MySQL!')
    })

    //toate tabelele si modificarile facute vor fi aici:
//     connection.query(
//         `
//     ALTER TABLE user 
//     DROP COLUMN readingChallengeId,
//     ADD COLUMN status VARCHAR(20) NOT NULL

//   `,
//         (err) => {
//             if (err) {
//                 console.error('Eroare la crearea tabelei:', err)
//                 throw err
//             }
//             console.log('Tabela a fost creată cu succes!')
//         }
//     )

    connection.query(
        `
      CREATE TABLE IF NOT EXISTS readingchallenge (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          numberOfBooks INT NOT NULL,
          currentNumberOfBooks  INT NOT NULL,
          type VARCHAR(45) NOT NULL
            )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
      CREATE TABLE IF NOT EXISTS user (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          lastName VARCHAR(45) NOT NULL,
          firstName VARCHAR(45) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(100) NOT NULL,
          description VARCHAR(200) ,
          favQuote VARCHAR(200) ,
          status VARCHAR(20)
      )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
      CREATE TABLE IF NOT EXISTS news (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          bookId INT NOT NULL,
          FOREIGN KEY (userId) REFERENCES user(id),
          FOREIGN KEY (bookId) REFERENCES book(id)
      )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
      CREATE TABLE IF NOT EXISTS userreadingch (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          readingchallengeId INT NOT NULL,
          FOREIGN KEY (userId) REFERENCES user(id),
          FOREIGN KEY (readingchallengeId) REFERENCES readingchallenge(id)
      )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
      CREATE TABLE IF NOT EXISTS book  (
          id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          title  VARCHAR(45) NOT NULL,
          author  VARCHAR(45) NOT NULL,
          genre  VARCHAR(45) NOT NULL,
          year  INT NOT NULL,
          rating  INT NOT NULL,
          publisher  VARCHAR(45) NOT NULL,
          editor  VARCHAR(45) NOT NULL,
          collection  VARCHAR(45)
         )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
      CREATE TABLE IF NOT EXISTS reading  (
          id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          userId  INT NOT NULL,
          bookId  INT NOT NULL ,
          startDate  DATE NOT NULL,
          currentPageNumber  INT NOT NULL,
          FOREIGN KEY (userId) REFERENCES user(id),
          FOREIGN KEY (bookId) REFERENCES book(id)
         )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS alreadyRead  (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            userId  INT NOT NULL,
            bookId  INT NOT NULL,
            finishDate  DATE NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id),
            FOREIGN KEY (bookId) REFERENCES book(id)
           )
           `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
      CREATE TABLE IF NOT EXISTS wanttoread  (
          id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          userId  INT NOT NULL,
          bookId  INT NOT NULL,
          FOREIGN KEY (userId) REFERENCES user(id),
          FOREIGN KEY (bookId) REFERENCES book(id)
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
      CREATE TABLE IF NOT EXISTS review  (
          id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          userId  INT NOT NULL,
          bookId  INT NOT NULL,
          reviewDescription  VARCHAR(200),
          rating  INT,
          date  DATE NOT NULL,
          FOREIGN KEY (userId) REFERENCES user(id),
          FOREIGN KEY (bookId) REFERENCES book(id)
       )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
      CREATE TABLE IF NOT EXISTS genre  (
          id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          genreTitle  VARCHAR(45) NOT NULL
         )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
      CREATE TABLE IF NOT EXISTS userpreferencies  (
          id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          userId  INT NOT NULL,
          genreId  INT NOT NULL ,
          FOREIGN KEY (userId) REFERENCES user(id),
          FOREIGN KEY (genreId) REFERENCES genre(id)
         )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS admin  (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            type  VARCHAR(45) NOT NULL,
            textRequest  VARCHAR(45) NOT NULL,
            userId  INT NOT NULL,
            bookId  INT NOT NULL,
            teamId  INT NOT NULL,
            question  VARCHAR(45) ,
            status  VARCHAR(45) NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id),
            FOREIGN KEY (bookId) REFERENCES book(id),
            FOREIGN KEY (teamId) REFERENCES team(id)
          )
      `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
       CREATE TABLE IF NOT EXISTS team(
       id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
       teamName  VARCHAR(45) NOT NULL,
       moderatorId  INT NOT NULL,
       description  VARCHAR(45),
       FOREIGN KEY (moderatorId) REFERENCES user(id)
      )
      `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS teamusers  (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            teamId  INT NOT NULL ,
            userId  INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id),
            FOREIGN KEY (teamId) REFERENCES team(id)
         )
      `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS teambooks  (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            teamId  INT NOT NULL,
            bookId  INT NOT NULL,
            FOREIGN KEY (teamId) REFERENCES team(id),
            FOREIGN KEY (bookId) REFERENCES book(id)
          )
      `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS teamconv  (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            teamId  INT NOT NULL,
            userId  INT NOT NULL,
            bookId  INT NOT NULL,
            text  VARCHAR(200) NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id),
            FOREIGN KEY (bookId) REFERENCES book(id),
            FOREIGN KEY (teamId) REFERENCES team(id)
         )
      `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei:', err)
                throw err
            }
            console.log('Tabela a fost creată cu succes!')
        }
    )

    return connection
}

module.exports = initializeDatabase
