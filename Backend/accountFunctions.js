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

const getUserDetails = (userId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT * FROM user WHERE id = ? LIMIT 1',
            [userId],
            (error, results) => {
                connection.release()
                if (error) {
                    return callback(error, null)
                }
                callback(null, results)
            }
        )
    })
}

const getUserGroups = (userId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            `SELECT t.id, t.teamName, t.photo 
             FROM teamusers tu 
             JOIN team t ON tu.teamId = t.id 
             WHERE tu.userId = ?`,
            [userId],
            (error, results) => {
                connection.release()
                if (error) {
                    return callback(error, null)
                }
                callback(null, results)
            }
        )
    })
}

const getModerator = (userId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT * FROM team WHERE moderatorId = ?',
            [userId],
            (error, results) => {
                connection.release()
                if (error) {
                    return callback(error, null)
                }
                callback(null, results)
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
            'SELECT * FROM team WHERE id = ? LIMIT 1',
            [groupId],
            (error, results) => {
                connection.release()
                if (error) {
                    return callback(error, null)
                }
                callback(null, results[0])
            }
        )
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

const handleLogout = (req, res) => {
    const token = getTokenFromCookie(req)
    if (!token) {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'No token provided' }))
        return
    }
    const secretKey =
        'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
    jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {
            res.writeHead(403, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Invalid token' }))
            return
        }
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0',
        })
        res.end(JSON.stringify({ message: 'User logged out successfully' }))
    })
}

function handleAccountDetails(req, res) {
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
        getIdUser(email, (err, result) => {
            if (err) {
                console.error('Error getting user ID:', err)
                res.write(JSON.stringify({ error: 'Error getting user ID.' }))
                res.end()
                return
            }

            const idUser = result[0].id

            getUserDetails(idUser, (error, userDetails) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Internal Server Error' }))
                    return
                }

                let response = {
                    userDetails: userDetails[0],
                }

                getModerator(idUser, (error, moderatorGroups) => {
                    if (error) {
                        res.writeHead(500, {
                            'Content-Type': 'application/json',
                        })
                        res.end(
                            JSON.stringify({ error: 'Internal Server Error' })
                        )
                        return
                    }

                    response.moderatorGroups = moderatorGroups

                    getUserGroups(idUser, (error, userGroups) => {
                        if (error) {
                            res.writeHead(500, {
                                'Content-Type': 'application/json',
                            })
                            res.end(
                                JSON.stringify({
                                    error: 'Internal Server Error',
                                })
                            )
                            return
                        }

                        response.userGroups = userGroups

                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        })
                        res.end(JSON.stringify(response))
                    })
                })
            })
        })
    })
}

const getNextGroupId = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection:', err)
            callback({ error: 'Server error' })
            return
        }

        connection.query(
            'SELECT MAX(id) AS maxId FROM team',
            (error, results) => {
                connection.release()

                if (error) {
                    console.error('Error querying MySQL:', error)
                    callback({ error: 'Database error' })
                    return
                }

                let nextId = results[0].maxId + 1
                callback(null, { nextGroupId: nextId })
            }
        )
    })
}

module.exports = {
    handleAccountDetails,
    getUserDetails,
    handleLogout,
    getNextGroupId,
}
