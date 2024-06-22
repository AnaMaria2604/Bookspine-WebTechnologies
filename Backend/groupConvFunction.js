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

function getGroupDetails(bookId, groupId, callback) {
    console.log(bookId)
    pool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            return callback(err, null)
        }

        // Step 1: Fetch team details
        connection.query(
            'SELECT teamName, moderatorId FROM team WHERE id = ?',
            [groupId],
            (error, teamResults) => {
                if (error) {
                    console.log('Error fetching team details:', error)
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

                // Step 2: Fetch moderator email
                connection.query(
                    'SELECT email FROM user WHERE id = ?',
                    [moderatorId],
                    (error, emailResult) => {
                        if (error) {
                            console.log(
                                'Error fetching moderator email:',
                                error
                            )
                            connection.release()
                            return callback(error, null)
                        }

                        const moderatorEmail =
                            emailResult.length > 0 ? emailResult[0].email : null

                        // Step 3: Fetch bookIds related to groupId
                        connection.query(
                            'SELECT bookId FROM teambooks WHERE teamId = ?',
                            [parseInt(groupId, 10)],
                            (error, teambookResults) => {
                                if (error) {
                                    console.log(
                                        'Error fetching bookIds:',
                                        error
                                    )
                                    connection.release()
                                    return callback(error, null)
                                }

                                const bookIds = teambookResults.map(
                                    (row) => row.bookId
                                )

                                // Step 4: Fetch book details
                                connection.query(
                                    'SELECT id, title FROM book WHERE id IN (?)',
                                    [bookIds],
                                    (error, bookResults) => {
                                        if (error) {
                                            console.log(
                                                'Error fetching book details:',
                                                error
                                            )
                                            connection.release()
                                            return callback(error, null)
                                        }

                                        // If no books found, return empty conversations array
                                        if (bookResults.length === 0) {
                                            connection.release()
                                            return callback(null, {
                                                team: teamResults,
                                                books: [],
                                                moderator: moderatorEmail,
                                                conversations: [],
                                                users: [],
                                            })
                                        }

                                        // Step 5: Fetch conversations related to bookId and groupId
                                        connection.query(
                                            'SELECT * FROM teamconv WHERE bookId = ? AND teamId = ?',
                                            [
                                                parseInt(bookId, 10),
                                                parseInt(groupId, 10),
                                            ],
                                            (error, convResults) => {
                                                if (error) {
                                                    console.log(
                                                        'Error fetching conversations:',
                                                        error
                                                    )
                                                    connection.release()
                                                    return callback(error, null)
                                                }

                                                const userIds = convResults.map(
                                                    (row) => row.userId
                                                )

                                                // Step 6: Fetch users related to userIds if userIds is not empty
                                                if (userIds.length > 0) {
                                                    connection.query(
                                                        'SELECT * FROM user WHERE id IN (?)',
                                                        [userIds],
                                                        (
                                                            error,
                                                            userConvResults
                                                        ) => {
                                                            connection.release()
                                                            if (error) {
                                                                console.log(
                                                                    'Error fetching users:',
                                                                    error
                                                                )
                                                                return callback(
                                                                    error,
                                                                    null
                                                                )
                                                            }

                                                            const combinedResults =
                                                                {
                                                                    team: teamResults,
                                                                    books: bookResults,
                                                                    moderator:
                                                                        moderatorEmail,
                                                                    conversations:
                                                                        convResults,
                                                                    users: userConvResults,
                                                                }
                                                            callback(
                                                                null,
                                                                combinedResults
                                                            )
                                                        }
                                                    )
                                                } else {
                                                    // No userIds found, return empty users array
                                                    connection.release()
                                                    const combinedResults = {
                                                        team: teamResults,
                                                        books: bookResults,
                                                        moderator:
                                                            moderatorEmail,
                                                        conversations:
                                                            convResults,
                                                        users: [],
                                                    }
                                                    callback(
                                                        null,
                                                        combinedResults
                                                    )
                                                }
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
