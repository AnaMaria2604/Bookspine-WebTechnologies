const pool = require('../DataBase/database')
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

function readImage(imagePath, callback) {
    fs.readFile(imagePath, (err, data) => {
        if (err) {
            return callback(
                new Error(
                    `Error reading image at ${imagePath}: ${err.message}`
                ),
                null
            )
        }
        callback(null, data)
    })
}

function checkEmailExists(email, callback) {
    const sql = 'SELECT id FROM user WHERE email = ?'
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(sql, [email], (err, results) => {
            connection.release()
            if (err) {
                return callback(err, null)
            }
            callback(null, results.length > 0)
        })
    })
}

function addAnnualReadingCh(userId, callback) {
    const sql =
        'INSERT INTO readingchallenge (userId, numberOfBooks, currentNumberOfBooks, type) VALUES (?,?,?,?)'
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            sql,
            [userId, 0, 0, 'Annual Reading Challenge'],
            (err, results) => {
                connection.release()
                if (err) {
                    return callback(err, null)
                }
                callback(null, results.insertId)
            }
        )
    })
}

function addMonthlyReadingCh(userId, callback) {
    const sql =
        'INSERT INTO readingchallenge (userId, numberOfBooks, currentNumberOfBooks, type) VALUES (?,?,?,?)'
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            sql,
            [userId, 0, 0, 'Monthly Reading Challenge'],
            (err, results) => {
                connection.release()
                if (err) {
                    return callback(err, null)
                }
                callback(null, results.insertId)
            }
        )
    })
}

function createAccount(
    lastName,
    firstName,
    email,
    password,
    confirmPassword,
    res
) {
    if (password !== confirmPassword) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ message: 'Passwords do not match' }))
    }

    checkEmailExists(email, (err, emailExists) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ message: 'Server error' }))
        }
        if (emailExists) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ message: 'Email already exists' }))
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                return res.end(
                    JSON.stringify({ message: 'Error hashing password' })
                )
            }

            const defaultPhotoPath = path.join(
                __dirname,
                'imageDef',
                'default.jpg'
            )
            readImage(defaultPhotoPath, (err, defaultPhoto) => {
                if (err) {
                    console.error(err.message)
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    return res.end(
                        JSON.stringify({ message: 'Error reading photo' })
                    )
                }

                const sql =
                    'INSERT INTO user (firstName, lastName, email, password, photo) VALUES (?, ?, ?, ?, ?)'

                pool.getConnection((err, connection) => {
                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'application/json',
                        })
                        return res.end(
                            JSON.stringify({ message: 'Server error' })
                        )
                    }
                    connection.query(
                        sql,
                        [
                            firstName,
                            lastName,
                            email,
                            hashedPassword,
                            defaultPhoto,
                        ],
                        (err, results) => {
                            if (err) {
                                connection.release()
                                res.writeHead(500, {
                                    'Content-Type': 'application/json',
                                })
                                return res.end(
                                    JSON.stringify({
                                        message: 'Error creating account',
                                    })
                                )
                            }

                            const userId = results.insertId

                            addAnnualReadingCh(userId, (err) => {
                                if (err) {
                                    console.error(err.message)
                                }

                                addMonthlyReadingCh(userId, (err) => {
                                    connection.release()
                                    if (err) {
                                        console.error(err.message)
                                    }
                                    res.writeHead(302, {
                                        Location: '/login',
                                    })
                                    res.end()
                                })
                            })
                        }
                    )
                })
            })
        })
    })
}

module.exports = { createAccount }
