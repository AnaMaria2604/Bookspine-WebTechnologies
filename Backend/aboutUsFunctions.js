const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')

function getAllUsers(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query('SELECT * FROM user LIMIT 1', (error, result) => {
            connection.release()
            if (error) {
                return callback(error, null)
            }
            callback(null, result)
        })
    })
}

function getConnectedUser(email, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT id FROM user WHERE email = ? LIMIT 1',
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

function handleAboutUsButton(req, res) {

    const token = getTokenFromCookie(req)
    let email

    if (token) {
        const secretKey =
            'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                console.log('Error decoding token:', err.message)
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ status: 0 })) // User guest
                return
            }
            email = decodedToken.email
        })
    }

    req.on('end', () => {
        if (!email) {
            getAllUsers((err, result) => {
                if (err) {
                    console.error('Error:', err)
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ status: 0 })) // Error, treat as guest
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ status: 0 })) // User guest
                }
            })
        } else {
            getConnectedUser(email, (err, result) => {
                if (err) {
                    console.error('Error:', err)
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ status: 0 })) // Error, treat as guest
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ status: 1 })) // User connected
                }
            })
        }
    })
    req.on('data', () => {})
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
    handleAboutUsButton,
}
