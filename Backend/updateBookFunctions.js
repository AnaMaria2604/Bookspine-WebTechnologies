const mysql = require('mysql')
const pool = require('../DataBase/database')

console.log('update book functions')

function handleBookForUpdateRequest(req, res, bookId) {
    console.log('bookid in functions: ' + bookId)
    getBookRequestForUpdate(bookId, (error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(results))
        }
    })
}

const getBookRequestForUpdate = (bookId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT * FROM book WHERE id = ? LIMIT 1',
            [bookId],
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
    handleBookForUpdateRequest,
    getBookRequestForUpdate,
}
