const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')

function handleGroupRequest(req, res, groupId) {
    getGroupDetails(groupId, (error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(results))
        }
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

const getGroupDetails = (groupId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT * FROM team WHERE id = ?',
            [groupId],
            (error, teamResults) => {
                if (error) {
                    connection.release()
                    return callback(error, null)
                }

                if (teamResults.length === 0) {
                    connection.release()
                    return callback(null, {
                        team: [],
                        books: [],
                        moderator: null,
                    })
                }

                const moderatorId = teamResults[0].moderatorId

                connection.query(
                    'SELECT lastName,firstName FROM user WHERE id = ?',
                    [moderatorId],
                    (error, userResults) => {
                        if (error) {
                            connection.release()
                            return callback(error, null)
                        }

                        const moderatorName =
                            userResults.length > 0
                                ? userResults[0].lastName +
                                  ' ' +
                                  userResults[0].firstName
                                : null

                        connection.query(
                            'SELECT bookId FROM teambooks WHERE teamId = ?',
                            [groupId],
                            (error, teambookResults) => {
                                if (error) {
                                    connection.release()
                                    return callback(error, null)
                                }

                                const bookIds = teambookResults.map(
                                    (row) => row.bookId
                                )
                                if (bookIds.length === 0) {
                                    connection.release()
                                    const combinedResults = {
                                        team: teamResults,
                                        books: [],
                                        moderator: moderatorName,
                                    }
                                    return callback(null, combinedResults)
                                }

                                connection.query(
                                    'SELECT id, title FROM book WHERE id IN (?)',
                                    [bookIds],
                                    (error, bookResults) => {
                                        connection.release()
                                        if (error) {
                                            return callback(error, null)
                                        }

                                        const combinedResults = {
                                            team: teamResults,
                                            books: bookResults,
                                            moderator: moderatorName,
                                        }
                                        callback(null, combinedResults)
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    })
}
function handleJoin(req, res) {
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
        const { groupId } = JSON.parse(body) // Parse body to extract groupId
        getIdUser(email, (err, result) => {
            if (err) {
                console.error('Error getting user ID:', err)
                res.write(JSON.stringify({ error: 'Error getting user ID.' }))
                res.end()
                return
            }

            const idUser = result[0].id
            handleGroupJoinForUser(idUser, groupId, (error, userGroups) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Internal Server Error' }))
                    return
                }

                const response = { userGroups }

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(response))
            })
        })
    })
}

function handleGroupJoinForUser(userId, groupId, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err)
            return callback(err)
        }

        if (typeof userId !== 'number' || typeof groupId !== 'number') {
            console.error('Invalid types for userId or groupId')
            connection.release()
            return callback(new Error('Invalid types for userId or groupId'))
        }

        const sql = `INSERT INTO teamusers (userId, teamId) VALUES (?, ?)`

        connection.query(sql, [userId, groupId], (error, results, fields) => {
            connection.release()

            if (error) {
                console.error('Error adding user to group:', error)
                return callback(error)
            }
            console.log(
                `User with ID ${userId} added to group with ID ${groupId}`
            )
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

module.exports = { handleGroupRequest, handleGroupJoinForUser, handleJoin }
