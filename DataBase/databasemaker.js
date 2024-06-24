const mysql = require('mysql')
const populateDatabase = require('./populationscript')

function initializeDatabase() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'data_base',
    })

    connection.connect((err) => {
        if (err) {
            console.error('Eroare la conectarea la baza de date:', err)
            throw err
        }
        console.log('Conectat cu succes la baza de date MySQL!')
    })

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
            collection  VARCHAR(45),
            description VARCHAR(2000),
            edition INT,
            cover MEDIUMBLOB
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei book:', err)
                throw err
            }
            console.log('Tabela book a fost creată cu succes!')
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
            description VARCHAR(200),
            favQuote VARCHAR(200),
            photo MEDIUMBLOB
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei user:', err)
                throw err
            }
            console.log('Tabela user a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS readingchallenge (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            numberOfBooks INT NOT NULL,
            currentNumberOfBooks  INT NOT NULL,
            type VARCHAR(45) NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
        )
    `,
        (err) => {
            if (err) {
                console.error(
                    'Eroare la crearea tabelei readingchallenge:',
                    err
                )
                throw err
            }
            console.log('Tabela readingchallenge a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS team (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            teamName  VARCHAR(45) NOT NULL,
            moderatorId  INT NOT NULL,
            description  VARCHAR(45),
            photo MEDIUMBLOB,
            FOREIGN KEY (moderatorId) REFERENCES user(id) ON DELETE CASCADE
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei team:', err)
                throw err
            }
            console.log('Tabela team a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS reading (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            userId  INT NOT NULL,
            bookId  INT NOT NULL ,
            startDate  DATE,
            currentPageNumber INT NOT NULL,
            descr VARCHAR(500),
            quote VARCHAR(400),
            updateDate VARCHAR(200) NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (bookId) REFERENCES book(id) ON DELETE CASCADE
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei reading:', err)
                throw err
            }
            console.log('Tabela reading a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS alreadyRead (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            userId  INT NOT NULL,
            bookId  INT NOT NULL,
            finishDate  DATE NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (bookId) REFERENCES book(id) ON DELETE CASCADE
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei alreadyRead:', err)
                throw err
            }
            console.log('Tabela alreadyRead a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS wanttoread (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            userId  INT NOT NULL,
            bookId  INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (bookId) REFERENCES book(id) ON DELETE CASCADE
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei wanttoread:', err)
                throw err
            }
            console.log('Tabela wanttoread a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS review (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            userId  INT NOT NULL,
            bookId  INT NOT NULL,
            reviewDescription  VARCHAR(200),
            rating  INT,
            date  DATE NOT NULL,
            reviewDate VARCHAR(200) NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (bookId) REFERENCES book(id) ON DELETE CASCADE
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei review:', err)
                throw err
            }
            console.log('Tabela review a fost creată cu succes!')
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
                console.error('Eroare la crearea tabelei genre:', err)
                throw err
            }
            console.log('Tabela genre a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS userpreferencies  (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            userId  INT NOT NULL,
            genreId  INT NOT NULL ,
            FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (genreId) REFERENCES genre(id)
        )
    `,
        (err) => {
            if (err) {
                console.error(
                    'Eroare la crearea tabelei userpreferencies:',
                    err
                )
                throw err
            }
            console.log('Tabela userpreferencies a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS admin (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei admin:', err)
                throw err
            }
            console.log('Tabela admin a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS teamusers  (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            teamId  INT NOT NULL ,
            userId  INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (teamId) REFERENCES team(id) ON DELETE CASCADE
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei teamusers:', err)
                throw err
            }
            console.log('Tabela teamusers a fost creată cu succes!')
        }
    )

    connection.query(
        `
        CREATE TABLE IF NOT EXISTS teambooks  (
            id  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            teamId  INT NOT NULL,
            bookId  INT NOT NULL,
            FOREIGN KEY (teamId) REFERENCES team(id) ON DELETE CASCADE,
            FOREIGN KEY (bookId) REFERENCES book(id) ON DELETE CASCADE
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei teambooks:', err)
                throw err
            }
            console.log('Tabela teambooks a fost creată cu succes!')
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
            FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (bookId) REFERENCES book(id) ON DELETE CASCADE,
            FOREIGN KEY (teamId) REFERENCES team(id) ON DELETE CASCADE
        )
    `,
        (err) => {
            if (err) {
                console.error('Eroare la crearea tabelei teamconv:', err)
                throw err
            }
            console.log('Tabela teamconv a fost creată cu succes!')
        }
    )

    populateDatabase(connection)

    return connection
}

module.exports = initializeDatabase
