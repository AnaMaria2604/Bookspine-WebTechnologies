const mysql = require('mysql')
const pool = require('../DataBase/database')

const getPopularBooks = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT * FROM book ORDER BY rating DESC LIMIT 7',
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

const getRecommendedBooks = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query('SELECT * FROM book LIMIT 7', (error, results) => {
            connection.release()
            if (error) {
                return callback(error, null)
            }
            callback(null, results) // Pass results to callback
        })
    })
}

function handleRecommendedBooksRequest(req, res) {
    getRecommendedBooks((error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(results))
        }
    })
}

function handlePopularBooksRequest(req, res) {
    getPopularBooks((error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(results))
        }
    })
}

module.exports = { handlePopularBooksRequest, handleRecommendedBooksRequest }
