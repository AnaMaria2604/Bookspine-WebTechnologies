const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')

const handleAdminPageRequest = (req, res) => {
    const filePath = path.join(
        __dirname,
        '../Frontend/Admin-Page/adminpage.html'
    )

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404)
            res.end('404 Not Found')
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(data)
        }
    })
}

function verifyIfIsAdmin(email, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return callback(err, null)
        }

        const query = 'SELECT id FROM admin WHERE email = ?'
        connection.query(query, [email], (error, results) => {
            connection.release()

            if (error) {
                console.error('Error executing query:', error)
                return callback(error, null)
            }

            if (results.length > 0) {
                return callback(null, true)
            } else {
                return callback(null, false)
            }
        })
    })
}
const handleAllUsersAndGroupsRequest = (req, res) => {
    const token = getTokenFromCookie(req)

    if (!token) {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Unauthorized' }))
        return
    }

    try {
        const secretKey =
            'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
        const decodedToken = jwt.verify(token, secretKey)
        const email = decodedToken.email

        verifyIfIsAdmin(email, (error, isAdmin) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Internal Server Error' }))
                return
            }

            if (!isAdmin) {
                res.writeHead(403, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Forbidden' }))
                return
            }

            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection:', err)
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Internal Server Error' }))
                    return
                }

                const queryUsers = 'SELECT id, email AS userEmail FROM user'
                connection.query(queryUsers, (errorUsers, resultsUsers) => {
                    if (errorUsers) {
                        connection.release()
                        console.error(
                            'Error executing query (users):',
                            errorUsers
                        )
                        res.writeHead(500, {
                            'Content-Type': 'application/json',
                        })
                        res.end(
                            JSON.stringify({ error: 'Internal Server Error' })
                        )
                        return
                    }

                    const queryTeams = 'SELECT id, teamName FROM team'
                    connection.query(queryTeams, (errorTeams, resultsTeams) => {
                        connection.release()

                        if (errorTeams) {
                            console.error(
                                'Error executing query (teams):',
                                errorTeams
                            )
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

                        // Construim răspunsul final
                        const response = {
                            users: resultsUsers.map((user) => ({
                                id: user.id,
                                email: user.userEmail,
                            })),
                            teams: resultsTeams.map((team) => ({
                                id: team.id,
                                teamName: team.teamName,
                            })),
                        }

                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        })
                        res.end(JSON.stringify(response))
                    })
                })
            })
        })
    } catch (error) {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Unauthorized' }))
    }
}

const handleDeleteUser = (req, res, userId) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Internal server error' }))
            return
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release()
                console.error('Error starting transaction:', err)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Internal server error' }))
                return
            }

            // Query pentru a verifica dacă utilizatorul este moderator
            const checkModeratorQuery = `
                SELECT id
                FROM team
                WHERE moderatorId = ?
            `

            connection.query(checkModeratorQuery, [userId], (err, results) => {
                if (err) {
                    connection.rollback(() => {
                        connection.release()
                        console.error('Error checking moderator status:', err)
                        res.statusCode = 500
                        res.setHeader('Content-Type', 'application/json')
                        res.end(
                            JSON.stringify({ error: 'Internal server error' })
                        )
                    })
                    return
                }

                const moderatorTeams = results

                // Construim array-ul de query-uri pentru ștergere
                const deleteQueries = [
                    `DELETE FROM teamusers WHERE userId = ?`,
                    `DELETE FROM teamconv WHERE userId = ?`,
                    `DELETE FROM review WHERE userId = ?`,
                    `DELETE FROM reading WHERE userId = ?`,
                    `DELETE FROM alreadyRead WHERE userId = ?`,
                    `DELETE FROM wanttoread WHERE userId = ?`,
                    `DELETE FROM news WHERE userId = ?`,
                    `DELETE FROM readingchallenge WHERE userId = ?`,
                    `DELETE FROM userpreferencies WHERE userId = ?`,
                    `DELETE FROM user WHERE id = ?`,
                ]

                // Adăugăm query-urile pentru ștergerea echipelor (dacă este moderator)
                moderatorTeams.forEach((team) => {
                    deleteQueries.push(`DELETE FROM team WHERE id = ${team.id}`)
                })

                // Executăm fiecare query într-o tranzacție
                deleteQueries
                    .reduce((promise, query) => {
                        return promise.then(() => {
                            return new Promise((resolve, reject) => {
                                connection.query(
                                    query,
                                    [userId],
                                    (err, results) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve(results)
                                        }
                                    }
                                )
                            })
                        })
                    }, Promise.resolve())
                    .then(() => {
                        connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    console.error(
                                        'Error committing transaction:',
                                        err
                                    )
                                    connection.release()
                                    res.statusCode = 500
                                    res.setHeader(
                                        'Content-Type',
                                        'application/json'
                                    )
                                    res.end(
                                        JSON.stringify({
                                            error: 'Internal server error',
                                        })
                                    )
                                })
                            }
                            console.log('User deleted successfully')
                            connection.release()
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.end(
                                JSON.stringify({
                                    message: 'User deleted successfully',
                                })
                            )
                        })
                    })
                    .catch((err) => {
                        connection.rollback(() => {
                            console.error(
                                'Error executing delete queries:',
                                err
                            )
                            connection.release()
                            res.statusCode = 500
                            res.setHeader('Content-Type', 'application/json')
                            res.end(
                                JSON.stringify({
                                    error: 'Internal server error',
                                })
                            )
                        })
                    })
            })
        })
    })
}

function handleDeleteGroup(req, res, groupId) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Internal server error' }))
            return
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release()
                console.error('Error starting transaction:', err)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Internal server error' }))
                return
            }

            const deleteQueries = [
                `DELETE FROM teamusers WHERE teamId = ?`,
                `DELETE FROM teamconv WHERE teamId = ?`,
                `DELETE FROM teambooks WHERE teamId = ?`,
                `DELETE FROM team WHERE id = ?`,
            ]

            deleteQueries
                .reduce((promise, query) => {
                    return promise.then(() => {
                        return new Promise((resolve, reject) => {
                            connection.query(
                                query,
                                [groupId],
                                (err, results) => {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        resolve(results)
                                    }
                                }
                            )
                        })
                    })
                }, Promise.resolve())
                .then(() => {
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error(
                                    'Error committing transaction:',
                                    err
                                )
                                connection.release()
                                res.statusCode = 500
                                res.setHeader(
                                    'Content-Type',
                                    'application/json'
                                )
                                res.end(
                                    JSON.stringify({
                                        error: 'Internal server error',
                                    })
                                )
                            })
                        }
                        console.log('Group deleted successfully')
                        connection.release()
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.end(
                            JSON.stringify({
                                message: 'Group deleted successfully',
                            })
                        )
                    })
                })
                .catch((err) => {
                    connection.rollback(() => {
                        console.error('Error executing delete queries:', err)
                        connection.release()
                        res.statusCode = 500
                        res.setHeader('Content-Type', 'application/json')
                        res.end(
                            JSON.stringify({ error: 'Internal server error' })
                        )
                    })
                })
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
    handleAdminPageRequest,
    handleAllUsersAndGroupsRequest,
    handleDeleteUser,
    handleDeleteGroup,
}
