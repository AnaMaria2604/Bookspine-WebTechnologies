const mysql = require('mysql')
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

module.exports = { handleGroupRequest }
