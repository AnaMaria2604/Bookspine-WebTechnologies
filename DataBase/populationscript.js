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
            '$10$8KHCUcF9ZflFhx8o00N4vOL/ln9k5f0icsMwfONR5LiVBQ1O40ABG',
            'I love reading mystery novels.',
            'To be, or not to be, that is the question.',
            readImage(path.join(__dirname, 'userImages', '3.jpg')),
        ],
        [
            'Jane',
            'Smith',
            'jane.smith@example.com',
            '$10$8KHCUcF9ZflFhx8o00N4vOL/ln9k5f0icsMwfONR5LiVBQ1O40ABG',
            'Avid reader of science fiction.',
            'The only limit to our realization of tomorrow is our doubts of today.',
            readImage(path.join(__dirname, 'userImages', '2.jpg')),
        ],
        [
            'Alice',
            'Johnson',
            'alice.johnson@example.com',
            '$10$8KHCUcF9ZflFhx8o00N4vOL/ln9k5f0icsMwfONR5LiVBQ1O40ABG',
            'Enjoys historical fiction.',
            'History is a vast early warning system.',
            readImage(path.join(__dirname, 'userImages', '1.jpg')),
        ],
        [
            'Bob',
            'Brown',
            'bob.brown@example.com',
            '$10$8KHCUcF9ZflFhx8o00N4vOL/ln9k5f0icsMwfONR5LiVBQ1O40ABG',
            'Fan of fantasy books.',
            'Not all those who wander are lost.',
            readImage(path.join(__dirname, 'userImages', '4.jpg')),
        ],
        [
            'Charlie',
            'Davis',
            'charlie.davis@example.com',
            '$10$8KHCUcF9ZflFhx8o00N4vOL/ln9k5f0icsMwfONR5LiVBQ1O40ABG',
            'Reading thrillers is my hobby.',
            'The truth is rarely pure and never simple.',
            readImage(path.join(__dirname, 'userImages', '5.jpg')),
        ],
        [
            'Diana',
            'Garcia',
            'diana.garcia@example.com',
            '$10$8KHCUcF9ZflFhx8o00N4vOL/ln9k5f0icsMwfONR5LiVBQ1O40ABG',
            'Loves classic literature.',
            'It is never too late to be what you might have been.',
            readImage(path.join(__dirname, 'userImages', '6.jpg')),
        ],
        [
            'Eve',
            'Martinez',
            'eve.martinez@example.com',
            '$10$8KHCUcF9ZflFhx8o00N4vOL/ln9k5f0icsMwfONR5LiVBQ1O40ABG',
            'Interested in biographies.',
            "Life is what happens when you're busy making other plans.",
            readImage(path.join(__dirname, 'userImages', '7.jpg')),
        ],
        [
            'Frank',
            'Wilson',
            'frank.wilson@example.com',
            '$10$8KHCUcF9ZflFhx8o00N4vOL/ln9k5f0icsMwfONR5LiVBQ1O40ABG',
            'Reading non-fiction books.',
            'Knowledge is power.',
            readImage(path.join(__dirname, 'userImages', '8.jpg')),
        ],
        [
            'Grace',
            'Lee',
            'grace.lee@example.com',
            '$10$8KHCUcF9ZflFhx8o00N4vOL/ln9k5f0icsMwfONR5LiVBQ1O40ABG',
            'Passionate about poetry.',
            'Poetry is when an emotion has found its thought and the thought has found words.',
            readImage(path.join(__dirname, 'userImages', '9.jpg')),
        ],
        [
            'Marry',
            'Clark',
            'hank.clark@example.com',
            '$10$8KHCUcF9ZflFhx8o00N4vOL/ln9k5f0icsMwfONR5LiVBQ1O40ABG',
            'Loves adventure stories.',
            'Adventure is worthwhile in itself.',
            readImage(path.join(__dirname, 'userImages', '10.jpg')),
        ],
    ]

    connection.query(
        'INSERT INTO user (firstName, lastName, email, password, description, favQuote, photo) VALUES ?',
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
            'Eternal',
            'The Great Gatsby, F. Scott Fitzgeralds third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted ~gin was the national drink and sex the national obsession~ it is an exquisitely crafted tale of America in the 1920s.',
            1940,
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
            'Page Turners',
            'A masterpiece of rebellion and imprisonment where war is peace freedom is slavery and Big Brother is watching Thought Police Big Brother Orwellian These words have entered our vocabulary because of George Orwell s classic dystopian novel 1984 The story of one man s nightmare odyssey as he pursues a forbidden love affair through a world ruled by warring states and a power structure that controls not only information but also individual thought and memory 1984 is a prophetic haunting tale More relevant than ever before 1984 exposes the worst crimes imaginable the destruction of truth freedom and individuality With a foreword by Thomas Pynchon With a foreword by Thomas Pynchon A masterpiece of rebellion and imprisonment where war is peace freedom is slavery and Big Brother is watching View our feature on George Orwell s 1984 Thought Police Big Brother Orwellian These words have entered our vocabulary because of George Orwell s classic dystopian novel 1984 The story of one man s nightmare odyssey as he pursues a forbidden love affair through a world ruled by warring states and a power structure that controls not only information but also individual thought and memory 1984 is a prophetic haunting tale More relevant than ever before 1984 exposes the worst crimes imaginable the destruction of truth freedom and individuality This beautiful paperback edition features deckled edges and french flaps a perfect gift for any occasion',
            1980,
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
            'Prose Paradise',
            'Compassionate, dramatic, and deeply moving, To Kill A Mockingbird takes readers to the roots of human behavior - to innocence and experience, kindness and cruelty, love and hatred, humor and pathos. Now with over 18 million copies in print and translated into forty languages, this regional story by a young Alabama woman claims universal appeal. Harper Lee always considered her book to be a simple love story. Today it is regarded as a masterpiece of American literature.',
            2005,
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
            'Vintage Volumes',
            'So Melville wrote of his masterpiece, one of the greatest works of imagination in literary history. In part, Moby-Dick is the story of an eerily compelling madman pursuing an unholy war against a creature as vast and dangerous and unknowable as the sea itself. But more than just a novel of adventure, more than an encyclopaedia of whaling lore and legend, the book can be seen as part of its authors lifelong meditation on America. Written with wonderfully redemptive humour, Moby-Dick is also a profound inquiry into character, faith, and the nature of perception.',
            1977,
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
            'Golden Pages',
            'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work "her own darling child" and its vivacious heroine, Elizabeth Bennet, "as delightful a creature as ever appeared in print." The romantic clash between the opinionated Elizabeth and her proud beau, Mr. Darcy, is a splendid performance of civilized sparring. And Jane Austens radiant wit sparkles as her characters dance a delicate quadrille of flirtation and intrigue, making this book the most superb comedy of manners of Regency England.',
            2000,
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
            'Historic Library',
            'The Catcher in the Rye is an all-time classic in coming-of-age literature- an elegy to teenage alienation, capturing the deeply human need for connection and the bewildering sense of loss as we leave childhood behind.',
            2003,
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
            'Legacy',
            'Aldous Huxleys profoundly important classic of world literature, Brave New World is a searching vision of an unequal, technologically-advanced future where humans are genetically bred, socially indoctrinated, and pharmaceutically anesthetized to passively uphold an authoritarian ruling order all at the cost of our freedom, full humanity, and perhaps also our souls. “A genius [who] who spent his life decrying the onward march of the Machine” (The New Yorker), Huxley was a man of incomparable talents: equally an artist, a spiritual seeker, and one of historys keenest observers of human nature and civilization. Brave New World, his masterpiece, has enthralled and terrified millions of readers, and retains its urgent relevance to this day as both a warning to be heeded as we head into tomorrow and as thought-provoking, satisfying work of literature. Written in the shadow of the rise of fascism during the 1930s, Brave New Worldd likewise speaks to a 21st-century world dominated by mass-entertainment, technology, medicine and pharmaceuticals, the arts of persuasion, and the hidden influence of elites.',
            1988,
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
            'Heritage Collection',
            'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.Written for J.R.R. Tolkiens own children, The Hobbit met with instant critical acclaim when it was first published in 1937. Now recognized as a timeless classic, this introduction to the hobbit Bilbo Baggins, the wizard Gandalf, Gollum, and the spectacular world of Middle-earth recounts of the adventures of a reluctant hero, a powerful and dangerous ring, and the cruel dragon Smaug the Magnificent. The text in this 372-page paperback edition is based on that first published in Great Britain by Collins Modern Classics (1998), and includes a note on the text by Douglas A. Anderson (2001).',
            1955,
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
            'Heritage',
            'Guy Montag is a fireman. His job is to destroy the most illegal of commodities, the printed book, along with the houses in which they are hidden. Montag never questions the destruction and ruin his actions produce, returning each day to his bland life and wife, Mildred, who spends all day with her television “family.” But when he meets an eccentric young neighbor, Clarisse, who introduces him to a past where people didn’t live in fear and to a present where one sees the world through the ideas in books instead of the mindless chatter of television, Montag begins to question everything he has ever known.',
            2022,
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
            'Classic Reads',
            'Charlotte Brontë tells the story of orphaned Jane Eyre, who grows up in the home of her heartless aunt, enduring loneliness and cruelty. This troubled childhood strengthens Janes natural independence and spirit - which prove necessary when she finds employment as a governess to the young ward of Byronic, brooding Mr Rochester. As her feelings for Rochester develop, Jane gradually uncovers Thornfield Halls terrible secret, forcing her to make a choice. Should she stay with Rochester and live with the consequences, or follow her convictions - even if it means leaving the man she loves? A novel of intense power and intrigue, Jane Eyre dazzled readers with its passionate depiction of a womans search for equality and freedom.',
            2007,
            readImage(path.join(__dirname, 'images', 'janeeyre.jpg')),
        ],
    ]

    connection.query(
        'INSERT INTO book (title, author, genre, year, rating, publisher, editor, collection, description, edition, cover) VALUES ?',
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
        [1, 10, 3, 'Annual Reading Challenge'],
        [1, 20, 5, 'Monthly Reading Challenge'],

        [2, 10, 7, 'Annual Reading Challenge'],
        [2, 20, 14, 'Monthly Reading Challenge'],

        [3, 20, 12, 'Annual Reading Challenge'],
        [3, 10, 5, 'Monthly Reading Challenge'],

        [4, 12, 3, 'Annual Reading Challenge'],
        [4, 20, 9, 'Monthly Reading Challenge'],

        [5, 10, 9, 'Annual Reading Challenge'],
        [5, 10, 2, 'Monthly Reading Challenge'],

        [6, 30, 26, 'Annual Reading Challenge'],
        [6, 7, 5, 'Monthly Reading Challenge'],

        [7, 15, 8, 'Annual Reading Challenge'],
        [7, 4, 2, 'Monthly Reading Challenge'],

        [8, 19, 6, 'Annual Reading Challenge'],
        [8, 4, 1, 'Monthly Reading Challenge'],

        [9, 36, 22, 'Annual Reading Challenge'],
        [9, 5, 5, 'Monthly Reading Challenge'],

        [10, 7, 6, 'Annual Reading Challenge'],
        [10, 3, 1, 'Monthly Reading Challenge'],
    ]

    connection.query(
        'INSERT INTO readingchallenge (userId, numberOfBooks, currentNumberOfBooks, type) VALUES ?',
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
        [
            'Book Lovers',
            1,
            'A team for those who love books.',
            path.resolve(__dirname, '..', 'Backend', 'groupImages', '1.jpg'),
        ],
        [
            'Sci-Fi Enthusiasts',
            2,
            'Discussing all things science fiction.',
            path.resolve(__dirname, '..', 'Backend', 'groupImages', '2.jpg'),
        ],
        [
            'Classic Literature Club',
            3,
            'Exploring classic literature.',
            path.resolve(__dirname, '..', 'Backend', 'groupImages', '3.jpg'),
        ],
        [
            'Fantasy Fans',
            4,
            'For fans of fantasy books.',
            path.resolve(__dirname, '..', 'Backend', 'groupImages', '4.jpg'),
        ],
        [
            'Mystery Solvers',
            5,
            'Solving mysteries one book at a time.',
            path.resolve(__dirname, '..', 'Backend', 'groupImages', '5.jpg'),
        ],
        [
            'Romance Readers',
            6,
            'For those who love romance novels.',
            path.resolve(__dirname, '..', 'Backend', 'groupImages', '6.jpg'),
        ],
        [
            'Biography Buffs',
            7,
            'Reading and discussing biographies.',
            path.resolve(__dirname, '..', 'Backend', 'groupImages', '7.jpg'),
        ],
        [
            'Poetry Lovers',
            8,
            'For those who appreciate poetry.',
            path.resolve(__dirname, '..', 'Backend', 'groupImages', '8.jpg'),
        ],
    ]

    connection.query(
        'INSERT INTO team (teamName, moderatorId, description, photo) VALUES ?',
        [teams],
        (err) => {
            if (err) {
                console.error('Eroare la inserarea echipelor:', err)
                throw err
            }
            console.log('Echipele au fost inserate cu succes!')
        }
    )

    const data = new Date()
    const readings = [
        [
            1,
            1,
            new Date('2024-01-01'),
            12,
            'Finished chapter 5. Very interesting!',
            ' ',
            data.toString(),
        ],
        [
            2,
            2,
            new Date('2024-02-01'),
            9,
            'Getting close to halfway through the book, the action is picking up',
            ' ',
            data.toString(),
        ],
        [
            3,
            3,
            new Date('2024-03-01'),
            124,
            'Just started reading and I am already hooked.',
            ' ',
            data.toString(),
        ],
        [
            4,
            4,
            new Date('2024-04-01'),
            389,
            'The characters are very well developed, especially the protagonist',
            ' ',
            data.toString(),
        ],
        [
            5,
            5,
            new Date('2024-05-01'),
            320,
            'The plot is thickening and I ca not put the book down.',
            ' ',
            data.toString(),
        ],
        [
            6,
            6,
            new Date('2024-06-01'),
            73,
            'Reached chapter 10. The story is gripping.',
            ' ',
            data.toString(),
        ],
        [
            7,
            7,
            new Date('2024-07-01'),
            10,
            'The reading is heavier than I expected but still interesting',
            ' ',
            data.toString(),
        ],
        [
            8,
            8,
            new Date('2024-08-01'),
            56,
            'Chapter 15 was full of surprises!',
            ' ',
            data.toString(),
        ],
        [
            9,
            9,
            new Date('2024-09-01'),
            120,
            'Finished the book. The ending was unexpected.',
            ' ',
            data.toString(),
        ],
        [
            10,
            10,
            new Date('2024-10-01'),
            502,
            'Learned a lot of new things from this book.',
            ' ',
            data.toString(),
        ],
    ]

    connection.query(
        'INSERT INTO reading (userId, bookId, startDate, currentPageNumber, descr, quote,updateDate) VALUES ?',
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
        [1, 6, new Date('2024-01-06')],

        [2, 3, new Date('2023-02-10')],
        [2, 9, new Date('2023-05-10')],

        [3, 4, new Date('2023-03-10')],
        [3, 8, new Date('2024-03-01')],

        [4, 5, new Date('2023-02-11')],
        [4, 1, new Date('2023-04-10')],

        [5, 6, new Date('2023-05-10')],
        [5, 3, new Date('2022-09-11')],

        [6, 7, new Date('2023-06-10')],
        [6, 6, new Date('2021-11-11')],

        [7, 8, new Date('2023-07-10')],
        [7, 8, new Date('2022-12-08')],

        [8, 9, new Date('2023-08-10')],
        [8, 9, new Date('2024-01-09')],

        [9, 10, new Date('2023-09-10')],
        [9, 10, new Date('2022-10-09')],

        [10, 1, new Date('2023-07-06')],
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
        [1, 9],
        [2, 4],
        [2, 1],
        [3, 5],
        [3, 7],
        [4, 6],
        [4, 5],
        [5, 7],
        [5, 2],
        [6, 8],
        [6, 10],
        [7, 9],
        [7, 4],
        [8, 10],
        [8, 3],
        [9, 1],
        [9, 5],
        [10, 2],
        [10, 7],
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
    const dataa = new Date()

    // Adăugăm recenzii
    const reviews = [
        [1, 2, 'An amazing read!', 5, new Date('2023-01-09'), dataa.toString()],
        [1, 7, 'An amazing read!', 5, new Date('2023-01-09'), dataa.toString()],
        [
            2,
            3,
            'Very interesting.',
            2,
            new Date('2023-02-07'),
            dataa.toString(),
        ],
        [
            2,
            9,
            'Very interesting.',
            2,
            new Date('2023-02-07'),
            dataa.toString(),
        ],
        [3, 4, 'It was okay.', 5, new Date('2023-03-10'), dataa.toString()],
        [3, 1, 'It was okay.', 5, new Date('2023-03-10'), dataa.toString()],
        [
            4,
            5,
            'Not my cup of tea.',
            4,
            new Date('2023-01-03'),
            dataa.toString(),
        ],
        [
            4,
            8,
            'Not my cup of tea.',
            4,
            new Date('2023-01-03'),
            dataa.toString(),
        ],
        [5, 6, "Didn't enjoy it.", 3, new Date('2023-05-03'), dataa.toString()],
        [5, 2, "Didn't enjoy it.", 3, new Date('2023-05-03'), dataa.toString()],
        [
            6,
            7,
            'Absolutely loved it!',
            1,
            new Date('2023-07-02'),
            dataa.toString(),
        ],
        [
            6,
            3,
            'Absolutely loved it!',
            1,
            new Date('2023-07-02'),
            dataa.toString(),
        ],
        [7, 8, 'Great book!', 5, new Date('2023-09-18'), dataa.toString()],
        [7, 9, 'Great book!', 5, new Date('2023-09-18'), dataa.toString()],
        [8, 9, 'It was decent.', 3, new Date('2023-10-15'), dataa.toString()],
        [8, 2, 'It was decent.', 3, new Date('2023-10-15'), dataa.toString()],
        [
            9,
            10,
            'Could have been better.',
            3,
            new Date('2023-02-10'),
            dataa.toString(),
        ],
        [
            9,
            5,
            'Could have been better.',
            3,
            new Date('2023-02-10'),
            dataa.toString(),
        ],
        [
            10,
            1,
            'Not worth the time.,',
            4,
            new Date('2023-03-09'),
            dataa.toString(),
        ],
        [
            10,
            6,
            'Not worth the time.,',
            4,
            new Date('2023-03-09'),
            dataa.toString(),
        ],
        [
            4,
            2,
            'An amazing read!!!!!!',
            5,
            new Date('2023-01-10'),
            dataa.toString(),
        ],
    ]

    connection.query(
        'INSERT INTO review (userId, bookId, reviewDescription,rating, date,reviewDate ) VALUES ?',
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
        ['Art'],
        ['Christian'],
        ['Crime'],
        ['Business'],
        ['Chick Lit'],
        ['Childrens'],
        ['Comics'],
        ['Cookbooks'],
        ['Ebooks'],
        ['Fiction'],
        ['Graphic Novels'],
        ['Historical Fiction'],
        ['Horror'],
        ['Manga'],
        ['Memoir'],
        ['Music'],
        ['Paranormal'],
        ['Philosophy'],
        ['Science'],
        ['Self Help'],
        ['Spirituality'],
        ['Sports'],
        ['Thriller'],
        ['Travel'],
        ['Contemporary'],
        ['Gay and Lesbian'],
        ['Humor and Comedy'],
        ['Nonfiction'],
        ['Religion'],
        ['Suspense'],
        ['Young Adult'],
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
        [1, 6],
        [1, 2],
        [2, 4],
        [2, 2],
        [2, 9],
        [3, 3],
        [3, 7],
        [3, 1],
        [4, 4],
        [4, 9],
        [4, 5],
        [5, 5],
        [5, 1],
        [5, 8],
        [6, 6],
        [6, 4],
        [6, 10],
        [7, 7],
        [7, 4],
        [7, 1],
        [8, 8],
        [8, 7],
        [8, 3],
        [9, 9],
        [9, 2],
        [9, 8],
        [10, 10],
        [10, 4],
        [10, 2],
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

    const teamBooks = [
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 8],
        [2, 5],
        [3, 9],
        [3, 2],
        [4, 8],
        [4, 2],
        [4, 9],
        [5, 4],
        [5, 2],
        [6, 1],
        [6, 5],
        [6, 6],
        [7, 2],
        [7, 7],
        [7, 3],
        [8, 4],
        [8, 7],
    ]

    connection.query(
        'INSERT INTO teambooks (teamId, bookId) VALUES ?',
        [teamBooks],
        (err) => {
            if (err) {
                console.error('Error inserting teamBooks:', err)
                throw err
            }
            console.log('Inserted into teambooks table successfully.')
        }
    )

    const teamConv = [
        [1, 1, 1, 'A good book!!'],
        [1, 7, 1, 'I only read 20 pages but I think it is so interesting!'],
        [1, 5, 3, 'Easy read for this weekend'],

        [2, 8, 1, 'An introspective exploration of love, loss'],
        [2, 2, 10, 'An insightful examination of family dynamics'],
        [2, 9, 10, 'A heartwarming story'],
        [2, 1, 5, 'A captivating journey through historical events'],

        [3, 4, 9, 'A thrilling adventure filled with unexpected turns'],
        [3, 8, 2, 'A heartwarming story that celebrates friendship'],
        [3, 6, 2, 'An introspective exploration of love, loss, and redemption'],

        [4, 3, 8, 'An immersive tale of adventure and discovery'],

        [5, 7, 10, 'A gripping psychological thriller'],
        [5, 9, 10, 'A poignant tribute to the power of literature'],
        [5, 1, 5, 'An epic tale of love and betrayal'],
    ]

    connection.query(
        'INSERT INTO teamconv (teamId, userId, bookId, text) VALUES ?',
        [teamConv],
        (err) => {
            if (err) {
                console.error('Error inserting team conversation:', err)
                throw err
            }
            console.log('Inserted into teamconversation table successfully.')
        }
    )
}
module.exports = populateDatabase
