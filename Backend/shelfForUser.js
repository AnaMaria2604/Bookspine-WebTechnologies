const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')

const getIdUser = (email, callback) => {
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

const addToWantToRead = (userId, bookId, callback) => {
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

function handleShelfsForLoggedUser(req, res) {
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

        getIdUser(email, (err, result) => {
            if (err) {
                console.error('Error getting user ID:', err)
                return
            }

            const idUser = result[0].id
            console.log('User ID for shelf:', idUser)

            addToWantToRead(idUser, 1, (err) => {
                if (err) {
                    console.error('Error adding to want-to-read list:', err)
                    return
                }
                console.log('Shelf updated successfully.')
            })
        })
    })
}

function getTokenFromCookie(req) {
    const cookies = req.headers.cookie
    if (cookies) {
        const parsedCookies = cookie.parse(cookies)
        const token = parsedCookies.token
        return token
    }
    return null
}

module.exports = { handleShelfsForLoggedUser }
