const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')
const bcrypt = require('bcrypt')


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

function handleAccount(req, res) {
    const token = getTokenFromCookie(req)
    let email

    if (token) {
        const secretKey =
            'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                console.log('Error decoding token:', err.message)
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Error decoding token.' }))
                return
            }
            email = decodedToken.email

            let body = ''
            req.on('data', (chunk) => {
                body += chunk.toString()
            })

            req.on('end', () => {
                try {
                    const formData = JSON.parse(body)
                    const {
                        firstName,
                        lastName,
                        email: newEmail,
                        password: pass1,
                        confirmPassword: pass2,
                        about: aboutUser,
                        quote: favQuote,
                    } = formData

                    getIdUser(email, (err, result) => {
                        if (err) {
                            console.error('Error getting user ID:', err)
                            res.writeHead(500, {
                                'Content-Type': 'application/json',
                            })
                            res.end(
                                JSON.stringify({
                                    error: 'Error getting user ID.',
                                })
                            )
                            return
                        }

                        const idUser = result[0].id

                        if (pass1 !== pass2) {
                            console.log("The passwords don't match.")
                            res.writeHead(400, {
                                'Content-Type': 'application/json',
                            })
                            res.end(
                                JSON.stringify({
                                    error: 'Passwords do not match.',
                                })
                            )
                            return
                        }

                        bcrypt.hash(pass1, 10, (err, hashedPassword) => {
                            if (err) {
                                res.writeHead(500, {
                                    'Content-Type': 'application/json',
                                })
                                res.end(
                                    JSON.stringify({
                                        message: 'Error hashing password',
                                    })
                                )
                                return
                            }

                            saveDetails(
                                aboutUser,
                                favQuote,
                                idUser,
                                firstName,
                                lastName,
                                newEmail,
                                hashedPassword,
                                (error, results) => {
                                    if (error) {
                                        console.error(
                                            'Error saving details:',
                                            error
                                        )
                                        res.writeHead(500, {
                                            'Content-Type': 'application/json',
                                        })
                                        res.end(
                                            JSON.stringify({
                                                error: 'Internal Server Error.',
                                            })
                                        )
                                    } else {
                                        res.writeHead(200, {
                                            'Content-Type': 'application/json',
                                        })
                                        res.end(JSON.stringify(results))
                                    }
                                }
                            )
                        })
                    })
                } catch (error) {
                    console.error('Error parsing form data:', error)
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(
                        JSON.stringify({ error: 'Error parsing form data.' })
                    )
                }
            })
        })
    } else {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Unauthorized.' }))
    }
}

const saveDetails = (
    aboutUser,
    favQuote,
    userId,
    firstName,
    lastName,
    newEmail,
    pass1,
    callback
) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Error getting connection:', err)
            return callback(err, null)
        }

        const params = []
        let query = 'UPDATE user SET '

        if (aboutUser !== undefined && aboutUser !== null && aboutUser !== '') {
            query += `description = ?, `
            params.push(aboutUser)
        }
        if (favQuote !== undefined && favQuote !== null && favQuote !== '') {
            query += `favQuote = ?, `
            params.push(favQuote)
        }
        if (lastName !== undefined && lastName !== null && lastName !== '') {
            query += `lastName = ?, `
            params.push(lastName)
        }
        if (firstName !== undefined && firstName !== null && firstName !== '') {
            query += `firstName = ?, `
            params.push(firstName)
        }
        if (newEmail !== undefined && newEmail !== null && newEmail !== '') {
            query += `email = ?, `
            params.push(newEmail)
        }
        if (pass1 !== undefined && pass1 !== null && pass1 !== '') {
            query += `password = ?, `
            params.push(pass1)
        }

        query = query.slice(0, -2)

        query += ' WHERE id = ?'
        params.push(userId)

        connection.query(query, params, (error, results) => {
            connection.release()

            if (error) {
                console.log('Error updating user details:', error)
                return callback(error, null)
            }

            console.log('User details updated successfully.')
            callback(null, results)
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
    handleAccount,
    saveDetails,
}
