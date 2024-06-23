const http = require('http')
const url = require('url')
const pool = require('../../DataBase/database')
// Helper function to get book covers for a list of books
const getBookCovers = (bookIds, callback) => {
    if (bookIds.length === 0) {
        return callback(null, [])
    }

    let covers = []
    let tasksCompleted = 0

    const checkCompletion = () => {
        tasksCompleted += 1
        if (tasksCompleted === bookIds.length) {
            callback(null, covers)
        }
    }

    bookIds.forEach((bookId) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return callback(err, null)
            }
            connection.query(
                'SELECT id, cover FROM book WHERE id = ? LIMIT 1',
                [bookId],
                (error, results) => {
                    connection.release()
                    if (error) {
                        return callback(error, null)
                    }
                    if (results.length > 0) {
                        covers.push(results[0])
                    }
                    checkCompletion()
                }
            )
        })
    })
}

const getBooks = (table, userId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            `SELECT bookId FROM ${table} WHERE userid = ? LIMIT 15`,
            [userId],
            (error, results) => {
                connection.release()
                if (error) {
                    return callback(error, null)
                }
                const bookIds = results.map((result) => result.bookId)
                getBookCovers(bookIds, callback)
            }
        )
    })
}
module.exports = {
    getBooks,
}
