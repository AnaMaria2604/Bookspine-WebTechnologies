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

function checkEmailExists(email) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT email FROM user WHERE email = ?'
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err)
            }
            connection.query(sql, [email], (err, results) => {
                connection.release()
                if (err) {
                    return reject(err)
                }
                if (results.length > 0) {
                    resolve(results[0].email)
                } else {
                    resolve(null)
                }
            })
        })
    })
}

function addAnnualReadingCh(userId) {
    return new Promise((resolve, reject) => {
        const sql =
            'INSERT INTO readingchallenge (userId, numberOfBooks, currentNumberOfBooks, type) VALUES (?,?,?,?)'
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err)
            }
            connection.query(
                sql,
                [userId, 0, 0, 'Annual Reading Challenge'],
                (err, results) => {
                    connection.release()
                    if (err) {
                        return reject(err)
                    }
                    resolve(results.insertId)
                }
            )
        })
    })
}

function addMonthlyReadingCh(userId) {
    return new Promise((resolve, reject) => {
        const sql =
            'INSERT INTO readingchallenge (userId, numberOfBooks, currentNumberOfBooks, type) VALUES (?,?,?,?)'
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err)
            }
            connection.query(
                sql,
                [userId, 0, 0, 'Monthly Reading Challenge'],
                (err, results) => {
                    connection.release()
                    if (err) {
                        return reject(err)
                    }
                    resolve(results.insertId)
                }
            )
        })
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

async function createAccount(
    lastName,
    firstName,
    email,
    password,
    confirmPassword
) {
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
    }

    const emailExists = await checkEmailExists(email)
    if (emailExists) {
        throw new Error('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const firstLetter = firstName.charAt(0)
    const defaultPhotoPath = getDefaultPhotoPath(firstLetter)

    return new Promise((resolve, reject) => {
        readImage(defaultPhotoPath, async (err, defaultPhoto) => {
            if (err) {
                return reject(new Error('Error reading photo'))
            }

            const sql =
                'INSERT INTO user (firstName, lastName, email, password, photo) VALUES (?, ?, ?, ?, ?)'
            pool.getConnection((err, connection) => {
                if (err) {
                    return reject(new Error('Server error'))
                }
                connection.query(
                    sql,
                    [firstName, lastName, email, hashedPassword, defaultPhoto],
                    async (err, results) => {
                        connection.release()
                        if (err) {
                            return reject(new Error('Error creating account'))
                        }

                        const userId = results.insertId
                        try {
                            await addAnnualReadingCh(userId)
                            await addMonthlyReadingCh(userId)
                            resolve()
                        } catch (err) {
                            reject(new Error('Error adding reading challenge'))
                        }
                    }
                )
            })
        })
    })
}

module.exports = { createAccount }
