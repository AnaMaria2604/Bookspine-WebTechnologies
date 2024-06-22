const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')

const updateChallenge = (chId, newNumberOfBooks, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err)
            return callback(err, null)
        }
        connection.query(
            'UPDATE readingchallenge SET numberOfBooks = ? WHERE id = ?',
            [newNumberOfBooks, chId],
            (error, results) => {
                connection.release()
                if (error) {
                    console.error('Error executing query:', error)
                    return callback(error, null)
                }
                callback(null, results)
            }
        )
    })
}
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

function handleupdateChallenge(req, res) {
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
        const { id: chId, numberOfBooks: newNumberOfBooks } = formData

        getIdUser(email, (err, result) => {
            if (err) {
                console.error('Error getting user ID:', err)
                res.write(JSON.stringify({ error: 'Error getting user ID.' }))
                res.end()
                return
            }

            updateChallenge(chId, newNumberOfBooks, (error, results) => {
                if (error) {
                    console.error('Error deleting challenge:', error)
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: 'Internal Server Error',
                        })
                    )
                    return
                }

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(
                    JSON.stringify({
                        success: true,
                        message: 'Challenge deleted successfully',
                    })
                )
            })
        })
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
    handleupdateChallenge,
}
