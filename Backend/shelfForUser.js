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

function addToWantToRead(userId, bookId, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }

        connection.query(
            'INSERT INTO wanttoread (userId, bookId) VALUES (?, ?)',
            [userId, bookId],
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

function addToReading(userId, bookId, callback) {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const startDate = `${year}-${month}-${day}`

    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }

        connection.query(
            'INSERT INTO reading (userId, bookId, startDate, currentPageNumber) VALUES (?, ?,?,0)',
            [userId, bookId, startDate],
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

function handleShelfReading(req, res) {
    console.log('handleReq')

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
        const formData = querystring.parse(body)
        console.log('Form data:', formData)
        console.log('Email:', email)
        const bookId = formData.bookId
        console.log('Book ID:', bookId)

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
            console.log('User ID for shelf:', idUser)

            addToReading(idUser, bookId, (err) => {
                if (err) {
                    console.error('Error adding to want-to-read list:', err)
                    res.write(
                        JSON.stringify({
                            error: 'Error adding to want-to-read list.',
                        })
                    )
                    res.end()
                    return
                }
                console.log('Shelf updated successfully.')
                res.write(
                    JSON.stringify({ message: 'Shelf updated successfully.' })
                )
                res.end()
            })
        })
    })
}

function handleShelfWantToRead(req, res) {
    console.log('handleReq')

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
        const formData = querystring.parse(body)
        console.log('Form data:', formData)
        console.log('Email:', email)
        const bookId = formData.bookId
        console.log('Book ID:', bookId)

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
            console.log('User ID for shelf:', idUser)

            addToWantToRead(idUser, bookId, (err) => {
                if (err) {
                    console.error('Error adding to want-to-read list:', err)
                    res.write(
                        JSON.stringify({
                            error: 'Error adding to want-to-read list.',
                        })
                    )
                    res.end()
                    return
                }
                console.log('Shelf updated successfully.')
                res.write(
                    JSON.stringify({ message: 'Shelf updated successfully.' })
                )
                res.end()
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
    handleShelfWantToRead,
    handleShelfReading,
}
