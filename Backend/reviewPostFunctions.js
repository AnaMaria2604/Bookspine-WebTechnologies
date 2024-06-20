const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')

function getIdUser(email, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }

        connection.query(
            'SELECT id FROM user WHERE email = ?',
            [email],
            (error, result) => {
                connection.release()
                if (error) {
                    return callback(error, null)
                }
                callback(null, result)
            }
        )
    })
}

function handleReview(req, res) {
    const token = getTokenFromCookie(req)
    let email

    if (token) {
        const secretKey =
            'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                console.log('Error decoding token:', err.message)
                return
            }
            email = decodedToken.email
        })
    }

    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })

    req.on('end', () => {
        const formData = JSON.parse(body)
        const { bookId, rating, review: text, endDate: date } = formData

        if (!bookId) {
            console.error('Book ID is missing.')
            res.write(JSON.stringify({ error: 'Book ID is required.' }))
            res.end()
            return
        }

        getIdUser(email, (err, result) => {
            if (err) {
                console.error('Error getting user ID:', err)
                res.write(JSON.stringify({ error: 'Error getting user ID.' }))
                res.end()
                return
            }

            const idUser = result[0].id

            postReview(bookId, idUser, rating, text, date, (error, results) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Internal Server Error' }))
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify(results))
                }
            })
        })
    })
}

const postReview = (bookId, userId, rating, text, date, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'INSERT INTO review (userId,bookId, reviewDescription, rating, date) VALUES (?, ?, ?, ?,?)',
            [userId, bookId, text, rating, date],
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

function getTokenFromCookie(req) {
    const cookies = req.headers.cookie
    if (cookies) {
        const parsedCookies = cookie.parse(cookies)
        return parsedCookies.token
    }
    return null
}

module.exports = {
    handleReview,
    postReview,
}
