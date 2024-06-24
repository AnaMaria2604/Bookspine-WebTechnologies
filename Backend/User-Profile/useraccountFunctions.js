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
