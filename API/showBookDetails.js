const mysql = require('mysql')
const pool = require('../DataBase/database')

function handleBookRequest(req, res, bookId) {
    console.log(bookId)
    getBookDetails(bookId, (error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(results))
        }
    })
}

const getBookDetails = (bookId, callback) => {
    // Adaugarea argumentului bookId
    console.log('aa')
    console.log(bookId)
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null) // Return error if unable to get connection
        }
        connection.query(
            'SELECT * FROM book WHERE id = ?',
            [bookId], // Adaugarea valorii bookId ca parametru în query
            (error, results) => {
                connection.release() // Release connection back to the pool
                if (error) {
                    return callback(error, null) // Pass error to callback
                }
                console.log('Query results:', results)
                callback(null, results) // Pass results to callback
            }
        )
    })
}
module.exports = { getBookDetails, handleBookRequest }
