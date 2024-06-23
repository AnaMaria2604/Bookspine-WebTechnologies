const mysql = require('mysql')
const pool = require('../../DataBase/database')

function handleUserDetails(req, res, userId) {
    getUserReviewDetails(userId, (error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(results))
        }
    })
}

const getUserReviewDetails = (userId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT * FROM user WHERE id = ?',
            [userId],
            (error, results) => {
                connection.release()
                if (error) {
                    return callback(error, null)
                }
                callback(null, results)
            }
        )
    })
}

module.exports = {
    handleUserDetails,
}

// const mysql = require('mysql')
// const pool = require('../DataBase/database')

// function handleUserDetails(req, res) {
//     const urlParts = req.url.split('/')
//     const userId = urlParts.pop() || urlParts.pop()

//     // Initializam variabilele pentru a stoca rezultatele
//     let userDetails,
//         readBooks,
//         readingBooks,
//         wantToReadBooks,
//         bookCovers = []

//     // Functie pentru a trimite raspunsul complet dupa ce toate datele sunt obtinute
//     function sendResponse() {
//         if (
//             userDetails &&
//             readBooks &&
//             readingBooks &&
//             wantToReadBooks &&
//             bookCovers.length === readBooks.length
//         ) {
//             res.writeHead(200, { 'Content-Type': 'application/json' })
//             res.end(
//                 JSON.stringify({
//                     userDetails,
//                     readBooks,
//                     readingBooks,
//                     wantToReadBooks,
//                     bookCovers,
//                 })
//             )
//         }
//     }

//     // Preluare detalii utilizator
//     getUserReviewDetails(userId, (error, results) => {
//         if (error) {
//             res.writeHead(500, { 'Content-Type': 'application/json' })
//             res.end(JSON.stringify({ error: 'Internal Server Error' }))
//             return
//         }
//         userDetails = results
//         sendResponse()
//     })

//     // Preluare carti citite
//     getReadBooks(userId, (error, results) => {
//         if (error) {
//             res.writeHead(500, { 'Content-Type': 'application/json' })
//             res.end(JSON.stringify({ error: 'Internal Server Error' }))
//             return
//         }
//         readBooks = results

//         readBooks.forEach((book) => {
//             getBookCover(book.bookId, (error, result) => {
//                 if (error) {
//                     res.writeHead(500, { 'Content-Type': 'application/json' })
//                     res.end(JSON.stringify({ error: 'Internal Server Error' }))
//                     return
//                 }
//                 bookCovers.push(result[0])
//                 sendResponse()
//             })
//         })

//         sendResponse()
//     })

//     // Preluare carti in curs de citire
//     getReadingBooks(userId, (error, results) => {
//         if (error) {
//             res.writeHead(500, { 'Content-Type': 'application/json' })
//             res.end(JSON.stringify({ error: 'Internal Server Error' }))
//             return
//         }
//         readingBooks = results
//         sendResponse()
//     })

//     // Preluare carti dorite pentru citire
//     getWantToReadBooks(userId, (error, results) => {
//         if (error) {
//             res.writeHead(500, { 'Content-Type': 'application/json' })
//             res.end(JSON.stringify({ error: 'Internal Server Error' }))
//             return
//         }
//         wantToReadBooks = results
//         sendResponse()
//     })
// }

// // Functii de baza de date
// const getUserReviewDetails = (userId, callback) => {
//     pool.getConnection((err, connection) => {
//         if (err) {
//             return callback(err, null)
//         }
//         connection.query(
//             'SELECT * FROM user WHERE id = ?',
//             [userId],
//             (error, results) => {
//                 connection.release()
//                 if (error) {
//                     return callback(error, null)
//                 }
//                 callback(null, results)
//             }
//         )
//     })
// }

// const getReadBooks = (userId, callback) => {
//     pool.getConnection((err, connection) => {
//         if (err) {
//             return callback(err, null)
//         }
//         connection.query(
//             'SELECT bookId FROM alreadyread WHERE id = ?',
//             [userId],
//             (error, results) => {
//                 connection.release()
//                 if (error) {
//                     return callback(error, null)
//                 }
//                 callback(null, results)
//             }
//         )
//     })
// }

// const getReadingBooks = (userId, callback) => {
//     pool.getConnection((err, connection) => {
//         if (err) {
//             return callback(err, null)
//         }
//         connection.query(
//             'SELECT bookId FROM reading WHERE id = ?',
//             [userId],
//             (error, results) => {
//                 connection.release()
//                 if (error) {
//                     return callback(error, null)
//                 }
//                 callback(null, results)
//             }
//         )
//     })
// }

// const getWantToReadBooks = (userId, callback) => {
//     pool.getConnection((err, connection) => {
//         if (err) {
//             return callback(err, null)
//         }
//         connection.query(
//             'SELECT bookId FROM wanttoread WHERE id = ?',
//             [userId],
//             (error, results) => {
//                 connection.release()
//                 if (error) {
//                     return callback(error, null)
//                 }
//                 callback(null, results)
//             }
//         )
//     })
// }

// const getBookCover = (bookId, callback) => {
//     pool.getConnection((err, connection) => {
//         if (err) {
//             return callback(err, null)
//         }
//         connection.query(
//             'SELECT id, cover FROM book WHERE id = ? LIMIT 1',
//             [bookId],
//             (error, results) => {
//                 connection.release()
//                 if (error) {
//                     return callback(error, null)
//                 }
//                 callback(null, results)
//             }
//         )
//     })
// }

// module.exports = {
//     handleUserDetails,
// }
