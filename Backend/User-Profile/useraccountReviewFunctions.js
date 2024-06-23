const http = require('http')
const url = require('url')
const pool = require('../../DataBase/database')

const getBookTitle = (bookId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT title FROM book WHERE id = ? LIMIT 1',
            [bookId],
            (error, results) => {
                connection.release()
                if (error) {
                    return callback(error, null)
                }
                if (results.length > 0) {
                    callback(null, results[0].title)
                } else {
                    callback(null, null)
                }
            }
        )
    })
}

const getReviewDetails = (userId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT bookId, reviewDescription, rating FROM review WHERE userId = ?',
            [userId],
            (error, results) => {
                connection.release()
                if (error) {
                    return callback(error, null)
                }

                if (results.length > 0) {
                    let details = []
                    let tasksCompleted = 0

                    const checkCompletion = () => {
                        tasksCompleted += 1
                        if (tasksCompleted === results.length) {
                            callback(null, details)
                        }
                    }
                    results.forEach((result) => {
                        getBookTitle(result.bookId, (err, bookTitle) => {
                            if (bookTitle) {
                                details.push({
                                    title: bookTitle,
                                    reviewDescription: result.reviewDescription,
                                    rating: result.rating,
                                })
                            }
                            checkCompletion()
                        })
                    })
                } else {
                    callback(null, [])
                }
            }
        )
    })
}

const getReadingDetails = (userId, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT bookId, currentPageNumber, descr FROM reading WHERE userId = ?',
            [userId],
            (error, results) => {
                connection.release()
                if (error) {
                    return callback(error, null)
                }
                if (results.length > 0) {
                    let details = []
                    let tasksCompleted = 0

                    const checkCompletion = () => {
                        tasksCompleted += 1
                        if (tasksCompleted === results.length) {
                            callback(null, details)
                        }
                    }

                    results.forEach((result) => {
                        getBookTitle(result.bookId, (err, bookTitle) => {
                            if (bookTitle) {
                                details.push({
                                    title: bookTitle,
                                    page: result.currentPageNumber,
                                    descr: result.descr,
                                })
                            }
                            checkCompletion()
                        })
                    })
                } else {
                    callback(null, [])
                }
            }
        )
    })
}

module.exports = {
    getBookTitle,
    getReviewDetails,
    getReadingDetails,
}
