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

function getDefaultPhotoPath(firstLetter) {
    let photoFileName
    switch (firstLetter.toLowerCase()) {
        case 'a':
            photoFileName = 'pozaA.jpg'
            break
        case 'b':
            photoFileName = 'pozaB.jpg'
            break
        case 'c':
            photoFileName = 'pozaC.jpg'
            break
        case 'd':
            photoFileName = 'pozaD.jpg'
            break
        case 'e':
            photoFileName = 'pozaE.jpg'
            break
        case 'f':
            photoFileName = 'pozaF.jpg'
            break
        case 'g':
            photoFileName = 'pozaG.jpg'
            break
        case 'h':
            photoFileName = 'pozaH.jpg'
            break
        case 'i':
            photoFileName = 'pozaI.jpg'
            break
        case 'j':
            photoFileName = 'pozaJ.jpg'
            break
        case 'k':
            photoFileName = 'pozaK.jpg'
            break
        case 'l':
            photoFileName = 'pozaL.jpg'
            break
        case 'm':
            photoFileName = 'pozaM.jpg'
            break
        case 'n':
            photoFileName = 'pozaN.jpg'
            break
        case 'o':
            photoFileName = 'pozaO.jpg'
            break
        case 'p':
            photoFileName = 'pozaP.jpg'
            break
        case 'q':
            photoFileName = 'pozaQ.jpg'
            break
        case 'r':
            photoFileName = 'pozaR.jpg'
            break
        case 's':
            photoFileName = 'pozaS.jpg'
            break
        case 't':
            photoFileName = 'pozaT.jpg'
            break
        case 'u':
            photoFileName = 'pozaU.jpg'
            break
        case 'v':
            photoFileName = 'pozaV.jpg'
            break
        case 'w':
            photoFileName = 'pozaW.jpg'
            break
        case 'x':
            photoFileName = 'pozaX.jpg'
            break
        case 'y':
            photoFileName = 'pozaY.jpg'
            break
        case 'z':
            photoFileName = 'pozaZ.jpg'
            break
        default:
            photoFileName = 'default.jpg'
            break
    }
    return path.join(__dirname, 'imageDef', photoFileName)
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
        throw new Error('Passwords do not match')
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

            const firstLetter = firstName.charAt(0)
            const defaultPhotoPath = getDefaultPhotoPath(firstLetter)

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
                                    console.error(
                                        'Error adding annual reading challenge:',
                                        err
                                    )
                                }
                                addMonthlyReadingCh(userId, (err) => {
                                    connection.release()
                                    if (err) {
                                        console.error(
                                            'Error adding monthly reading challenge:',
                                            err
                                        )
                                        res.writeHead(500, {
                                            'Content-Type': 'application/json',
                                        })
                                        return res.end(
                                            JSON.stringify({
                                                message:
                                                    'Error adding reading challenge',
                                            })
                                        )
                                    }
                                    res.writeHead(302, { Location: '/login' })
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
