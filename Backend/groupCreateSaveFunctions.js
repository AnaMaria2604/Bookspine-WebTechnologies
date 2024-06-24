const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')
const bcrypt = require('bcrypt')

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

function handleSave(req, res) {
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
                        title: title,
                        description: description,
                        alegeri: alegeriFacute,
                        groupId: groupId,
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

                        saveTeamDetails(
                            title,
                            idUser,
                            description,
                            (error, teamResult) => {
                                if (error) {
                                    console.error(
                                        'Error saving team details:',
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
                                    const teamId = teamResult.insertId
                                    const bookIds =
                                        Object.values(alegeriFacute).map(Number)
                                    saveTeamBooks(
                                        teamId,
                                        bookIds,
                                        (error, booksResult) => {
                                            if (error) {
                                                console.error(
                                                    'Error saving team books:',
                                                    error
                                                )
                                                res.writeHead(500, {
                                                    'Content-Type':
                                                        'application/json',
                                                })
                                                res.end(
                                                    JSON.stringify({
                                                        error: 'Internal Server Error.',
                                                    })
                                                )
                                            } else {
                                                res.writeHead(200, {
                                                    'Content-Type':
                                                        'application/json',
                                                })
                                                res.end(
                                                    JSON.stringify({
                                                        success: true,
                                                        teamId: teamId,
                                                        booksResult:
                                                            booksResult,
                                                    })
                                                )
                                            }
                                        }
                                    )
                                }
                            }
                        )
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

const saveTeamDetails = (teamName, moderatorId, description, callback) => {
    const randomNumber = Math.floor(Math.random() * 10) + 1
    const imageNr = `${randomNumber}.jpg`
    let defaultPhotoPath

    switch (randomNumber) {
        case 1:
            defaultPhotoPath = path.join(__dirname, 'groupsImages', '1.jpg')
            break
        case 2:
            defaultPhotoPath = path.join(__dirname, 'groupsImages', '2.jpg')
            break
        case 3:
            defaultPhotoPath = path.join(__dirname, 'groupsImages', '3.jpg')
            break
        case 4:
            defaultPhotoPath = path.join(__dirname, 'groupsImages', '4.jpg')
            break
        case 5:
            defaultPhotoPath = path.join(__dirname, 'groupsImages', '5.jpg')
            break
        case 6:
            defaultPhotoPath = path.join(__dirname, 'groupsImages', '6.jpg')
            break
        case 7:
            defaultPhotoPath = path.join(__dirname, 'groupsImages', '7.jpg')
            break
        case 8:
            defaultPhotoPath = path.join(__dirname, 'groupsImages', '8.jpg')
            break
        case 9:
            defaultPhotoPath = path.join(__dirname, 'groupsImages', '9.jpg')
            break
        case 10:
            defaultPhotoPath = path.join(__dirname, 'groupsImages', '10.jpg')
            break
        default:
            defaultPhotoPath = path.join(
                __dirname,
                'groupsImages',
                'default.jpg'
            )
            break
    }
    readImage(defaultPhotoPath, (err, defaultPhoto) => {
        if (err) {
            console.error(err.message)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ message: 'Error reading photo' }))
        }
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Error getting connection:', err)
                return callback(err, null)
            }

            const params = []
            let query = 'INSERT INTO team (teamName, moderatorId'

            if (
                description !== undefined &&
                description !== null &&
                description !== ''
            ) {
                query += `, description`
                params.push(description)
            }
            if (
                defaultPhoto !== undefined &&
                defaultPhoto !== null &&
                defaultPhoto !== ''
            ) {
                query += `, photo`
                params.push(defaultPhoto)
            }

            query += ') VALUES (?, ?'

            if (
                description !== undefined &&
                description !== null &&
                description !== ''
            ) {
                query += `, ?`
            }
            if (
                defaultPhotoPath !== undefined &&
                defaultPhotoPath !== null &&
                defaultPhotoPath !== ''
            ) {
                query += `, ?`
            }

            query += ')'
            params.unshift(moderatorId)
            params.unshift(teamName)

            connection.query(query, params, (error, results) => {
                connection.release()

                if (error) {
                    console.log('Error inserting team details:', error)
                    return callback(error, null)
                }

                console.log('Team details inserted successfully.')
                callback(null, results)
            })
        })
    })
}

const saveTeamBooks = (teamId, bookIds, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return callback(err, null)
        }

        if (!Array.isArray(bookIds) || bookIds.length === 0) {
            const error = new Error('Invalid bookIds array')
            console.error(error.message)
            connection.release()
            return callback(error, null)
        }

        const validBookIds = bookIds.filter((bookId) => {
            return bookId !== null && bookId !== undefined && bookId !== 0
        })

        if (validBookIds.length === 0) {
            console.log('No valid bookIds to insert.')
            connection.release()
            return callback(null, [])
        }

        const params = []
        let query = 'INSERT INTO teambooks (teamId, bookId) VALUES '
        const placeholders = validBookIds.map(() => '(?, ?)').join(', ')
        query += placeholders

        validBookIds.forEach((bookId) => {
            params.push(teamId, bookId)
        })

        connection.query(query, params, (error, results) => {
            connection.release()

            if (error) {
                console.error('Error inserting teambooks details:', error)
                return callback(error, null)
            }

            console.log('Teambooks details inserted successfully.')
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
    handleSave,
}
