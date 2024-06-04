const mysql = require('mysql')
const fs = require('fs')
const path = require('path')

function populateDatabase(connection) {
    // Funcție pentru citirea unei imagini de pe disc
    function readImage(filePath) {
        return fs.readFileSync(filePath)
    }

    // Adăugăm utilizatori
    const users = [
        [
            'John',
            'Doe',
            'john.doe@example.com',
            'password123',
            'I love reading mystery novels.',
            'To be, or not to be, that is the question.',
        ],
        [
            'Jane',
            'Smith',
            'jane.smith@example.com',
            'password456',
            'Avid reader of science fiction.',
            'The only limit to our realization of tomorrow is our doubts of today.',
        ],
        [
            'Alice',
            'Johnson',
            'alice.johnson@example.com',
            'password789',
            'Enjoys historical fiction.',
            'History is a vast early warning system.',
        ],
        [
            'Bob',
            'Brown',
            'bob.brown@example.com',
            'password012',
            'Fan of fantasy books.',
            'Not all those who wander are lost.',
        ],
        [
            'Charlie',
            'Davis',
            'charlie.davis@example.com',
            'password345',
            'Reading thrillers is my hobby.',
            'The truth is rarely pure and never simple.',
        ],
        [
            'Diana',
            'Garcia',
            'diana.garcia@example.com',
            'password678',
            'Loves classic literature.',
            'It is never too late to be what you might have been.',
        ],
        [
            'Eve',
            'Martinez',
            'eve.martinez@example.com',
            'password901',
            'Interested in biographies.',
            "Life is what happens when you're busy making other plans.",
        ],
        [
            'Frank',
            'Wilson',
            'frank.wilson@example.com',
            'password234',
            'Reading non-fiction books.',
            'Knowledge is power.',
        ],
        [
            'Grace',
            'Lee',
            'grace.lee@example.com',
            'password567',
            'Passionate about poetry.',
            'Poetry is when an emotion has found its thought and the thought has found words.',
        ],
        [
            'Hank',
            'Clark',
            'hank.clark@example.com',
            'password890',
            'Loves adventure stories.',
            'Adventure is worthwhile in itself.',
        ],
    ]

    connection.query(
        'INSERT INTO user (firstName, lastName, email, password, description, favQuote) VALUES ?',
        [users],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea utilizatorilor:', err)
                throw err
            }
            console.log('Utilizatorii au fost inserați cu succes!')
        }
    )

    // Adăugăm cărți
    const books = [
        [
            'The Great Gatsby',
            'F. Scott Fitzgerald',
            'Classic',
            1925,
            5,
            'Scribner',
            'Maxwell Perkins',
            'Classics',
            'The Great Gatsby, F. Scott Fitzgeralds third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted ~gin was the national drink and sex the national obsession~ it is an exquisitely crafted tale of America in the 1920s.',
            readImage(path.join(__dirname, 'images', 'gatsby.jpg')),
        ],
        [
            '1984',
            'George Orwell',
            'Dystopian',
            1949,
            5,
            'Secker & Warburg',
            'Fredric Warburg',
            'Classics',
            'A masterpiece of rebellion and imprisonment where war is peace freedom is slavery and Big Brother is watching Thought Police Big Brother Orwellian These words have entered our vocabulary because of George Orwell s classic dystopian novel 1984 The story of one man s nightmare odyssey as he pursues a forbidden love affair through a world ruled by warring states and a power structure that controls not only information but also individual thought and memory 1984 is a prophetic haunting tale More relevant than ever before 1984 exposes the worst crimes imaginable the destruction of truth freedom and individuality With a foreword by Thomas Pynchon With a foreword by Thomas Pynchon A masterpiece of rebellion and imprisonment where war is peace freedom is slavery and Big Brother is watching View our feature on George Orwell s 1984 Thought Police Big Brother Orwellian These words have entered our vocabulary because of George Orwell s classic dystopian novel 1984 The story of one man s nightmare odyssey as he pursues a forbidden love affair through a world ruled by warring states and a power structure that controls not only information but also individual thought and memory 1984 is a prophetic haunting tale More relevant than ever before 1984 exposes the worst crimes imaginable the destruction of truth freedom and individuality This beautiful paperback edition features deckled edges and french flaps a perfect gift for any occasion',
            readImage(path.join(__dirname, 'images', '1984.jpg')),
        ],
        [
            'To Kill a Mockingbird',
            'Harper Lee',
            'Classic',
            1960,
            5,
            'J.B. Lippincott & Co.',
            'Tay Hohoff',
            'Classics',
            'Compassionate, dramatic, and deeply moving, To Kill A Mockingbird takes readers to the roots of human behavior - to innocence and experience, kindness and cruelty, love and hatred, humor and pathos. Now with over 18 million copies in print and translated into forty languages, this regional story by a young Alabama woman claims universal appeal. Harper Lee always considered her book to be a simple love story. Today it is regarded as a masterpiece of American literature.',
            readImage(path.join(__dirname, 'images', 'mockingbird.jpg')),
        ],
        [
            'Moby-Dick',
            'Herman Melville',
            'Adventure',
            1851,
            4,
            'Harper & Brothers',
            'Richard Bentley',
            'Classics',
            'So Melville wrote of his masterpiece, one of the greatest works of imagination in literary history. In part, Moby-Dick is the story of an eerily compelling madman pursuing an unholy war against a creature as vast and dangerous and unknowable as the sea itself. But more than just a novel of adventure, more than an encyclopaedia of whaling lore and legend, the book can be seen as part of its authors lifelong meditation on America. Written with wonderfully redemptive humour, Moby-Dick is also a profound inquiry into character, faith, and the nature of perception.',
            readImage(path.join(__dirname, 'images', 'moby-dick.jpg')),
        ],
        [
            'Pride and Prejudice',
            'Jane Austen',
            'Romance',
            1813,
            5,
            'T. Egerton',
            'Thomas Egerton',
            'Classics',
            'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work "her own darling child" and its vivacious heroine, Elizabeth Bennet, "as delightful a creature as ever appeared in print." The romantic clash between the opinionated Elizabeth and her proud beau, Mr. Darcy, is a splendid performance of civilized sparring. And Jane Austens radiant wit sparkles as her characters dance a delicate quadrille of flirtation and intrigue, making this book the most superb comedy of manners of Regency England.',
            readImage(path.join(__dirname, 'images', 'pride.jpg')),
        ],
        [
            'The Catcher in the Rye',
            'J.D. Salinger',
            'Classic',
            1951,
            4,
            'Little, Brown and Company',
            'Robert Giroux',
            'Classics',
            'The Catcher in the Rye is an all-time classic in coming-of-age literature- an elegy to teenage alienation, capturing the deeply human need for connection and the bewildering sense of loss as we leave childhood behind.',
            readImage(path.join(__dirname, 'images', 'catcher.jpg')),
        ],
        [
            'Brave New World',
            'Aldous Huxley',
            'Dystopian',
            1932,
            5,
            'Chatto & Windus',
            'Davidson Bal',
            'Classics',
            'Aldous Huxleys profoundly important classic of world literature, Brave New World is a searching vision of an unequal, technologically-advanced future where humans are genetically bred, socially indoctrinated, and pharmaceutically anesthetized to passively uphold an authoritarian ruling order all at the cost of our freedom, full humanity, and perhaps also our souls. “A genius [who] who spent his life decrying the onward march of the Machine” (The New Yorker), Huxley was a man of incomparable talents: equally an artist, a spiritual seeker, and one of historys keenest observers of human nature and civilization. Brave New World, his masterpiece, has enthralled and terrified millions of readers, and retains its urgent relevance to this day as both a warning to be heeded as we head into tomorrow and as thought-provoking, satisfying work of literature. Written in the shadow of the rise of fascism during the 1930s, Brave New Worldd likewise speaks to a 21st-century world dominated by mass-entertainment, technology, medicine and pharmaceuticals, the arts of persuasion, and the hidden influence of elites.',
            readImage(path.join(__dirname, 'images', 'bravenewworld.jpg')),
        ],
        [
            'The Hobbit',
            'J.R.R. Tolkien',
            'Fantasy',
            1937,
            5,
            'George Allen & Unwin',
            'Stanley Unwin',
            'Classics',
            'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.Written for J.R.R. Tolkiens own children, The Hobbit met with instant critical acclaim when it was first published in 1937. Now recognized as a timeless classic, this introduction to the hobbit Bilbo Baggins, the wizard Gandalf, Gollum, and the spectacular world of Middle-earth recounts of the adventures of a reluctant hero, a powerful and dangerous ring, and the cruel dragon Smaug the Magnificent. The text in this 372-page paperback edition is based on that first published in Great Britain by Collins Modern Classics (1998), and includes a note on the text by Douglas A. Anderson (2001).',
            readImage(path.join(__dirname, 'images', 'hobbit.jpg')),
        ],
        [
            'Fahrenheit 451',
            'Ray Bradbury',
            'Dystopian',
            1953,
            4,
            'Ballantine Books',
            'William Morrow',
            'Classics',
            'Guy Montag is a fireman. His job is to destroy the most illegal of commodities, the printed book, along with the houses in which they are hidden. Montag never questions the destruction and ruin his actions produce, returning each day to his bland life and wife, Mildred, who spends all day with her television “family.” But when he meets an eccentric young neighbor, Clarisse, who introduces him to a past where people didn’t live in fear and to a present where one sees the world through the ideas in books instead of the mindless chatter of television, Montag begins to question everything he has ever known.',
            readImage(path.join(__dirname, 'images', 'fahrenheit.jpg')),
        ],
        [
            'Jane Eyre',
            'Charlotte Brontë',
            'Romance',
            1847,
            5,
            'Smith, Elder & Co.',
            'W.S. Williams',
            'Classics',
            'Charlotte Brontë tells the story of orphaned Jane Eyre, who grows up in the home of her heartless aunt, enduring loneliness and cruelty. This troubled childhood strengthens Janes natural independence and spirit - which prove necessary when she finds employment as a governess to the young ward of Byronic, brooding Mr Rochester. As her feelings for Rochester develop, Jane gradually uncovers Thornfield Halls terrible secret, forcing her to make a choice. Should she stay with Rochester and live with the consequences, or follow her convictions - even if it means leaving the man she loves? A novel of intense power and intrigue, Jane Eyre dazzled readers with its passionate depiction of a womans search for equality and freedom.',
            readImage(path.join(__dirname, 'images', 'janeeyre.jpg')),
        ],
    ]

    connection.query(
        'INSERT INTO book (title, author, genre, year, rating, publisher, editor, collection, description, cover) VALUES ?',
        [books],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea cărților:', err)
                throw err
            }
            console.log('Cărțile au fost inserate cu succes!')
        }
    )

    // Adăugăm provocări de lectură
    const readingChallenges = [
        [10, 3, 'Annual Reading Challenge'],
        [20, 5, 'Monthly Reading Challenge'],
        [15, 10, 'Summer Reading Challenge'],
        [5, 1, 'Winter Reading Challenge'],
        [50, 20, '50 Book Challenge'],
        [12, 4, '12 Month, 12 Books Challenge'],
        [30, 15, '30 Book Challenge'],
        [25, 10, 'Quarterly Reading Challenge'],
        [7, 2, 'Weekly Reading Challenge'],
        [3, 0, 'Weekend Reading Challenge'],
    ]

    connection.query(
        'INSERT INTO readingchallenge (numberOfBooks, currentNumberOfBooks, type) VALUES ?',
        [readingChallenges],
        (err) => {
            if (err) {
                console.error(
                    'Eroare la inserarea provocărilor de lectură:',
                    err
                )
                throw err
            }
            console.log('Provocările de lectură au fost inserate cu succes!')
        }
    )

    // Adăugăm echipe
    const teams = [
        ['Book Lovers', 1, 'A team for those who love books.'],
        ['Sci-Fi Enthusiasts', 2, 'Discussing all things science fiction.'],
        ['Classic Literature Club', 3, 'Exploring classic literature.'],
        ['Fantasy Fans', 4, 'For fans of fantasy books.'],
        ['Mystery Solvers', 5, 'Solving mysteries one book at a time.'],
        ['Romance Readers', 6, 'For those who love romance novels.'],
        ['Biography Buffs', 7, 'Reading and discussing biographies.'],
        ['History Readers', 8, 'Exploring historical books.'],
        ['Adventure Seekers', 9, 'Reading adventure stories.'],
        ['Poetry Lovers', 10, 'For those who appreciate poetry.'],
    ]

    connection.query(
        'INSERT INTO team (teamName, moderatorId, description) VALUES ?',
        [teams],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea echipelor:', err)
                throw err
            }
            console.log('Echipele au fost inserate cu succes!')
        }
    )

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
        [10, 10],
    ]

    connection.query(
        'INSERT INTO news (userId, bookId) VALUES ?',
        [news],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea știrilor:', err)
                throw err
            }
            console.log('Știrile au fost inserate cu succes!')
        }
    )

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
        [10, 10, new Date('2024-10-01'), 500],
    ]

    connection.query(
        'INSERT INTO reading (userId, bookId, startDate, currentPageNumber) VALUES ?',
        [readings],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea citirilor:', err)
                throw err
            }
            console.log('Citirile au fost inserate cu succes!')
        }
    )

    // Adăugăm cărți deja citite
    const alreadyRead = [
        [1, 2, new Date('2023-01-10')],
        [2, 3, new Date('2023-02-10')],
        [3, 4, new Date('2023-03-10')],
        [4, 5, new Date('2023-04-10')],
        [5, 6, new Date('2023-05-10')],
        [6, 7, new Date('2023-06-10')],
        [7, 8, new Date('2023-07-10')],
        [8, 9, new Date('2023-08-10')],
        [9, 10, new Date('2023-09-10')],
        [10, 1, new Date('2023-10-10')],
    ]

    connection.query(
        'INSERT INTO alreadyread (userId, bookId, finishDate) VALUES ?',
        [alreadyRead],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea cărților deja citite:', err)
                throw err
            }
            console.log('Cărțile deja citite au fost inserate cu succes!')
        }
    )

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
        [10, 2],
    ]

    connection.query(
        'INSERT INTO wanttoread (userId, bookId) VALUES ?',
        [wantToRead],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea dorințelor de lectură:', err)
                throw err
            }
            console.log('Dorințele de lectură au fost inserate cu succes!')
        }
    )

    // Adăugăm recenzii
    const reviews = [
        [1, 2, 'An amazing read!', 5, new Date('2023-01-09')],
        [2, 3, 'Very interesting.', 2, new Date('2023-02-07')],
        [3, 4, 'It was okay.', 5, new Date('2023-03-10')],
        [4, 5, 'Not my cup of tea.', 4, new Date('2023-01-03')],
        [5, 6, "Didn't enjoy it.", 3, new Date('2023-05-03')],
        [6, 7, 'Absolutely loved it!', 1, new Date('2023-07-02')],
        [7, 8, 'Great book!', 5, new Date('2023-09-18')],
        [8, 9, 'It was decent.', 3, new Date('2023-10-15')],
        [9, 10, 'Could have been better.', 3, new Date('2023-02-10')],
        [10, 1, 'Not worth the time.,', 4, new Date('2023-03-09')],
    ]

    connection.query(
        'INSERT INTO review (userId, bookId, reviewDescription,rating, date) VALUES ?',
        [reviews],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea recenziilor:', err)
                throw err
            }
            console.log('Recenziile au fost inserate cu succes!')
        }
    )

    // Adăugăm genuri
    const genres = [
        ['Classic'],
        ['Science Fiction'],
        ['Fantasy'],
        ['Mystery'],
        ['Romance'],
        ['Biography'],
        ['History'],
        ['Adventure'],
        ['Dystopian'],
        ['Poetry'],
    ]

    connection.query(
        'INSERT INTO genre (genreTitle) VALUES ?',
        [genres.map((genre) => [genre])],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea genurilor:', err)
                throw err
            }
            console.log('Genurile au fost inserate cu succes!')
        }
    )

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
        [10, 10],
    ]

    connection.query(
        'INSERT INTO userpreferencies (userId, genreId) VALUES ?',
        [userPreferences],
        (err) => {
            if (err) {
                console.error(
                    'Eroare la inserarea preferințelor utilizatorilor:',
                    err
                )
                throw err
            }
            console.log(
                'Preferințele utilizatorilor au fost inserate cu succes!'
            )
            connection.end()
        }
    )
}
module.exports = populateDatabase
