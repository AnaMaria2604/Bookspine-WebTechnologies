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
                    const { title: title, description: description } = formData

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
    const defaultPhotoPath = path.join(__dirname, 'imageDef', 'default.jpg')

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
            defaultPhotoPath !== undefined &&
            defaultPhotoPath !== null &&
            defaultPhotoPath !== ''
        ) {
            query += `, photo`
            params.push(defaultPhotoPath)
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
