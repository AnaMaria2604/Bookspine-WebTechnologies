const mysql = require('mysql');
const fs = require('fs');
const path = require('path');


function populateDatabase(connection) {


    // Funcție pentru citirea unei imagini de pe disc
    function readImage(filePath) {
        return fs.readFileSync(filePath);
    }

    // Adăugăm utilizatori
    const users = [
        ["John", "Doe", "john.doe@example.com", "password123", "I love reading mystery novels.", "To be, or not to be, that is the question.", "active"],
        ["Jane", "Smith", "jane.smith@example.com", "password456", "Avid reader of science fiction.", "The only limit to our realization of tomorrow is our doubts of today.", "inactive"],
        ["Alice", "Johnson", "alice.johnson@example.com", "password789", "Enjoys historical fiction.", "History is a vast early warning system.", "active"],
        ["Bob", "Brown", "bob.brown@example.com", "password012", "Fan of fantasy books.", "Not all those who wander are lost.", "active"],
        ["Charlie", "Davis", "charlie.davis@example.com", "password345", "Reading thrillers is my hobby.", "The truth is rarely pure and never simple.", "inactive"],
        ["Diana", "Garcia", "diana.garcia@example.com", "password678", "Loves classic literature.", "It is never too late to be what you might have been.", "active"],
        ["Eve", "Martinez", "eve.martinez@example.com", "password901", "Interested in biographies.", "Life is what happens when you're busy making other plans.", "active"],
        ["Frank", "Wilson", "frank.wilson@example.com", "password234", "Reading non-fiction books.", "Knowledge is power.", "inactive"],
        ["Grace", "Lee", "grace.lee@example.com", "password567", "Passionate about poetry.", "Poetry is when an emotion has found its thought and the thought has found words.", "active"],
        ["Hank", "Clark", "hank.clark@example.com", "password890", "Loves adventure stories.", "Adventure is worthwhile in itself.", "active"]
    ];

    connection.query(
        'INSERT INTO user (firstName, lastName, email, password, description, favQuote, status) VALUES ?',
        [users],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea utilizatorilor:', err);
                throw err;
            }
            console.log('Utilizatorii au fost inserați cu succes!');
        }
    );

    // Adăugăm cărți
    const books = [
        ["The Great Gatsby", "F. Scott Fitzgerald", "Classic", 1925, 5, "Scribner", "Maxwell Perkins", "Classics", readImage(path.join(__dirname, 'images', 'gatsby.jpg'))],
        ["1984", "George Orwell", "Dystopian", 1949, 5, "Secker & Warburg", "Fredric Warburg", "Classics", readImage(path.join(__dirname, 'images', '1984.jpg'))],
        ["To Kill a Mockingbird", "Harper Lee", "Classic", 1960, 5, "J.B. Lippincott & Co.", "Tay Hohoff", "Classics", readImage(path.join(__dirname, 'images', 'mockingbird.jpg'))],
        ["Moby-Dick", "Herman Melville", "Adventure", 1851, 4, "Harper & Brothers", "Richard Bentley", "Classics", readImage(path.join(__dirname, 'images', 'moby-dick.jpg'))],
        ["Pride and Prejudice", "Jane Austen", "Romance", 1813, 5, "T. Egerton", "Thomas Egerton", "Classics", readImage(path.join(__dirname, 'images', 'pride.jpg'))],
        ["The Catcher in the Rye", "J.D. Salinger", "Classic", 1951, 4, "Little, Brown and Company", "Robert Giroux", "Classics", readImage(path.join(__dirname, 'images', 'catcher.jpg'))],
        ["Brave New World", "Aldous Huxley", "Dystopian", 1932, 5, "Chatto & Windus", "Davidson Bal", "Classics", readImage(path.join(__dirname, 'images', 'bravenewworld.jpg'))],
        ["The Hobbit", "J.R.R. Tolkien", "Fantasy", 1937, 5, "George Allen & Unwin", "Stanley Unwin", "Classics", readImage(path.join(__dirname, 'images', 'hobbit.jpg'))],
        ["Fahrenheit 451", "Ray Bradbury", "Dystopian", 1953, 4, "Ballantine Books", "William Morrow", "Classics", readImage(path.join(__dirname, 'images', 'fahrenheit.jpg'))],
        ["Jane Eyre", "Charlotte Brontë", "Romance", 1847, 5, "Smith, Elder & Co.", "W.S. Williams", "Classics", readImage(path.join(__dirname, 'images', 'janeeyre.jpg'))]
    ];

    connection.query(
        'INSERT INTO book (title, author, genre, year, rating, publisher, editor, collection, cover) VALUES ?',
        [books],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea cărților:', err);
                throw err;
            }
            console.log('Cărțile au fost inserate cu succes!');
        }
    );

    // Adăugăm provocări de lectură
    const readingChallenges = [
        [10, 3, "Annual Reading Challenge"],
        [20, 5, "Monthly Reading Challenge"],
        [15, 10, "Summer Reading Challenge"],
        [5, 1, "Winter Reading Challenge"],
        [50, 20, "50 Book Challenge"],
        [12, 4, "12 Month, 12 Books Challenge"],
        [30, 15, "30 Book Challenge"],
        [25, 10, "Quarterly Reading Challenge"],
        [7, 2, "Weekly Reading Challenge"],
        [3, 0, "Weekend Reading Challenge"]
    ];

    connection.query(
        'INSERT INTO readingchallenge (numberOfBooks, currentNumberOfBooks, type) VALUES ?',
        [readingChallenges],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea provocărilor de lectură:', err);
                throw err;
            }
            console.log('Provocările de lectură au fost inserate cu succes!');
        }
    );

    // Adăugăm echipe
    const teams = [
        ["Book Lovers", 1, "A team for those who love books."],
        ["Sci-Fi Enthusiasts", 2, "Discussing all things science fiction."],
        ["Classic Literature Club", 3, "Exploring classic literature."],
        ["Fantasy Fans", 4, "For fans of fantasy books."],
        ["Mystery Solvers", 5, "Solving mysteries one book at a time."],
        ["Romance Readers", 6, "For those who love romance novels."],
        ["Biography Buffs", 7, "Reading and discussing biographies."],
        ["History Readers", 8, "Exploring historical books."],
        ["Adventure Seekers", 9, "Reading adventure stories."],
        ["Poetry Lovers", 10, "For those who appreciate poetry."]
    ];

    connection.query(
        'INSERT INTO team (teamName, moderatorId, description) VALUES ?',
        [teams],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea echipelor:', err);
                throw err;
            }
            console.log('Echipele au fost inserate cu succes!');
        }
    );

    // Adăugăm știri
    const news = [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
        [8, 8],
        [9, 9],
        [10, 10]
    ];

    connection.query(
        'INSERT INTO news (userId, bookId) VALUES ?',
        [news],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea știrilor:', err);
                throw err;
            }
            console.log('Știrile au fost inserate cu succes!');
        }
    );

    // Adăugăm citiri
    const readings = [
        [1, 1, new Date('2024-01-01'), 50],
        [2, 2, new Date('2024-02-01'), 100],
        [3, 3, new Date('2024-03-01'), 150],
        [4, 4, new Date('2024-04-01'), 200],
        [5, 5, new Date('2024-05-01'), 250],
        [6, 6, new Date('2024-06-01'), 300],
        [7, 7, new Date('2024-07-01'), 350],
        [8, 8, new Date('2024-08-01'), 400],
        [9, 9, new Date('2024-09-01'), 450],
        [10, 10, new Date('2024-10-01'), 500]
    ];

    connection.query(
        'INSERT INTO reading (userId, bookId, startDate, currentPageNumber) VALUES ?',
        [readings],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea citirilor:', err);
                throw err;
            }
            console.log('Citirile au fost inserate cu succes!');
        }
    );

    // Adăugăm cărți deja citite
    const alreadyRead = [
        [1, 2,new Date('2023-01-10')],
        [2, 3,new Date('2023-02-10')],
        [3, 4,new Date('2023-03-10')],
        [4, 5,new Date('2023-04-10')],
        [5, 6,new Date('2023-05-10')],
        [6, 7,new Date('2023-06-10')],
        [7, 8,new Date('2023-07-10')],
        [8, 9,new Date('2023-08-10')],
        [9, 10,new Date('2023-09-10')],
        [10, 1, new Date('2023-10-10')]
    ];

    connection.query(
        'INSERT INTO alreadyread (userId, bookId, finishDate) VALUES ?',
        [alreadyRead],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea cărților deja citite:', err);
                throw err;
            }
            console.log('Cărțile deja citite au fost inserate cu succes!');
        }
    );

    // Adăugăm dorințe de lectură
    const wantToRead = [
        [1, 3],
        [2, 4],
        [3, 5],
        [4, 6],
        [5, 7],
        [6, 8],
        [7, 9],
        [8, 10],
        [9, 1],
        [10, 2]
    ];

    connection.query(
        'INSERT INTO wanttoread (userId, bookId) VALUES ?',
        [wantToRead],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea dorințelor de lectură:', err);
                throw err;
            }
            console.log('Dorințele de lectură au fost inserate cu succes!');
        }
    );

    // Adăugăm recenzii
    const reviews = [
        [1, 2, "An amazing read!", 5,new Date('2023-01-09')],
        [2, 3, "Very interesting.",2,new Date('2023-02-07')],
        [3, 4, "It was okay.",5,new Date('2023-03-10')],
        [4, 5,  "Not my cup of tea.",4,new Date('2023-01-03')],
        [5, 6,  "Didn't enjoy it.",3,new Date('2023-05-03')],
        [6, 7,  "Absolutely loved it!",1,new Date('2023-07-02')],
        [7, 8,  "Great book!",5,new Date('2023-09-18')],
        [8, 9,  "It was decent.",3,new Date('2023-10-15')],
        [9, 10,  "Could have been better.",3,new Date('2023-02-10')],
        [10, 1,  "Not worth the time.,",4,new Date('2023-03-09')]
    ];

    connection.query(
        'INSERT INTO review (userId, bookId, reviewDescription,rating, date) VALUES ?',
        [reviews],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea recenziilor:', err);
                throw err;
            }
            console.log('Recenziile au fost inserate cu succes!');
        }
    );

    // Adăugăm genuri
    const genres = [
        ["Classic"],
        ["Science Fiction"],
        ["Fantasy"],
        ["Mystery"],
        ["Romance"],
        ["Biography"],
        ["History"],
        ["Adventure"],
        ["Dystopian"],
        ["Poetry"]
    ];

    connection.query(
        'INSERT INTO genre (genreTitle) VALUES ?',
        [genres.map((genre) => [genre])],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea genurilor:', err);
                throw err;
            }
            console.log('Genurile au fost inserate cu succes!');
        }
    );

    // Adăugăm preferințele utilizatorilor
    const userPreferences = [
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
        [8, 8],
        [9, 9],
        [10, 10]
    ];

    connection.query(
        'INSERT INTO userpreferencies (userId, genreId) VALUES ?',
        [userPreferences],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea preferințelor utilizatorilor:', err);
                throw err;
            }
            console.log('Preferințele utilizatorilor au fost inserate cu succes!');
            connection.end();
        }
    );
}
module.exports=populateDatabase;
