const mysql = require('mysql')
const pool = require('../DataBase/database')

function handleGroupConvRequest(req, res, bookId, groupId) {
    console.log('Fetching group details...')
    getGroupDetails(bookId, groupId, (error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(results))
        }
    })
}

const getGroupDetails = (bookId, groupId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }

        // Step 1: Fetch team details
        connection.query(
            'SELECT teamName, moderatorId FROM team WHERE id = ?',
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
                        conversations: [],
                        users: [],
                    })
                }

                const moderatorId = teamResults[0].moderatorId

                // Step 2: Fetch bookIds related to groupId
                connection.query(
                    'SELECT bookId FROM teambooks WHERE teamId = ?',
                    [parseInt(groupId, 10)],
                    (error, teambookResults) => {
                        if (error) {
                            connection.release()
                            return callback(error, null)
                        }

                        const bookIds = teambookResults.map((row) => row.bookId)

                        connection.query(
                            'SELECT id, title FROM book WHERE id IN (?)',
                            [bookIds],
                            (error, bookResults) => {
                                if (error) {
                                    connection.release()
                                    return callback(error, null)
                                }

                                // If no books found, return empty conversations array
                                if (bookResults.length === 0) {
                                    connection.release()
                                    return callback(null, {
                                        team: teamResults,
                                        books: [],
                                        moderator: moderatorId,
                                        conversations: [],
                                        users: [],
                                    })
                                }

                                // Step 4: Fetch conversations related to bookId and groupId
                                connection.query(
                                    'SELECT * FROM teamConv WHERE bookId = ? AND teamId = ?',
                                    [
                                        parseInt(bookId, 10),
                                        parseInt(groupId, 10),
                                    ],
                                    (error, convResults) => {
                                        if (error) {
                                            connection.release()
                                            return callback(error, null)
                                        }

                                        const userIds = convResults.map(
                                            (row) => row.userId
                                        )
                                        if (userIds.length == 0) {
                                            connection.release()
                                            return callback(null, {
                                                team: teamResults,
                                                books: bookResults,
                                                moderator: moderatorId,
                                                conversations: [],
                                                users: [],
                                            })
                                        }
                                        // Step 5: Fetch users related to userIds
                                        connection.query(
                                            'SELECT * FROM user WHERE id IN (?)',
                                            [userIds],
                                            (error, userConvResults) => {
                                                connection.release()
                                                if (error) {
                                                    return callback(error, null)
                                                }

                                                const combinedResults = {
                                                    team: teamResults,
                                                    books: bookResults,
                                                    moderator: moderatorId,
                                                    conversations: convResults,
                                                    users: userConvResults,
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
            }
        )
    })
}

module.exports = { handleGroupConvRequest }
