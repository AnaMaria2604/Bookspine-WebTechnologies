const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')

const handleMainPage = (req, res) => {
    const filePath = path.join(__dirname, '../Frontend/Main-Page/mainpage.html')

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
const getDetailsAndUpdates = (id, callback) => {
    console.log('Starting getDetailsAndUpdates')
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return callback(err, null)
        }

        const wantToReadQuery = 'SELECT bookId FROM wanttoread WHERE userId = ?'
        const currentlyReadingQuery =
            'SELECT bookId FROM reading WHERE userId = ?'

        let wantToReadBookIds
        let currentlyReadingBookIds

        // First, fetch wanttoread bookIds
        connection.query(wantToReadQuery, [id], (error, wantToReadBooks) => {
            if (error) {
                console.error('Error executing wantToReadQuery:', error)
                connection.release()
                return callback(error, null)
            }

            wantToReadBookIds = wantToReadBooks.map((row) => row.bookId)

            // Next, fetch currentlyreading bookIds
            connection.query(
                currentlyReadingQuery,
                [id],
                (error, currentlyReadingBooks) => {
                    if (error) {
                        console.error(
                            'Error executing currentlyReadingQuery:',
                            error
                        )
                        connection.release()
                        return callback(error, null)
                    }

                    currentlyReadingBookIds = currentlyReadingBooks.map(
                        (row) => row.bookId
                    )

                    // Combine both sets of bookIds
                    const allBookIds = [
                        ...new Set([
                            ...wantToReadBookIds,
                            ...currentlyReadingBookIds,
                        ]),
                    ]

                    if (allBookIds.length === 0) {
                        // If no books found in either list, proceed with reviews and readings fetch
                        fetchReviewsReadingsAndReadingch(
                            id,
                            connection,
                            (error, results) => {
                                if (error) {
                                    console.error(
                                        'Error fetching reviews, readings, and readingch:',
                                        error
                                    )
                                    connection.release()
                                    return callback(error, null)
                                }
                                connection.release()
                                callback(null, {
                                    wantToReadBooks: [],
                                    currentlyReadingBooks: [],
                                    ...results,
                                })
                            }
                        )
                    } else {
                        // Fetch details for books in both wanttoread and currentlyreading lists
                        const booksQuery =
                            'SELECT id, title, cover FROM book WHERE id IN (?)'

                        connection.query(
                            booksQuery,
                            [allBookIds],
                            (error, bookDetails) => {
                                if (error) {
                                    console.error(
                                        'Error executing booksQuery:',
                                        error
                                    )
                                    connection.release()
                                    return callback(error, null)
                                }

                                const wantToReadBookDetails =
                                    bookDetails.filter((book) =>
                                        wantToReadBookIds.includes(book.id)
                                    )
                                const currentlyReadingBookDetails =
                                    bookDetails.filter((book) =>
                                        currentlyReadingBookIds.includes(
                                            book.id
                                        )
                                    )

                                // Fetch reviews, readings, and readingch
                                fetchReviewsReadingsAndReadingch(
                                    id,
                                    connection,
                                    (error, results) => {
                                        if (error) {
                                            console.error(
                                                'Error fetching reviews, readings, and readingch:',
                                                error
                                            )
                                            connection.release()
                                            return callback(error, null)
                                        }
                                        connection.release()
                                        callback(null, {
                                            wantToReadBooks:
                                                wantToReadBookDetails,
                                            currentlyReadingBooks:
                                                currentlyReadingBookDetails,
                                            ...results,
                                        })
                                    }
                                )
                            }
                        )
                    }
                }
            )
        })
    })
}

const fetchReviewsReadingsAndReadingch = (userId, connection, callback) => {
    const reviewsQuery = `
        SELECT review.*, book.title AS bookTitle 
        FROM review 
        INNER JOIN book ON review.bookId = book.id
    `
    const readingsQuery = `
        SELECT reading.*, book.title AS bookTitle 
        FROM reading 
        INNER JOIN book ON reading.bookId = book.id
    `
    const readingchQuery = `
        SELECT numberOfBooks, currentNumberOfBooks 
        FROM readingchallenge
        WHERE userId = ?
    `

    connection.query(reviewsQuery, (error, reviews) => {
        if (error) {
            console.error('Error executing reviewsQuery:', error)
            return callback(error, null)
        }

        connection.query(readingsQuery, (readingError, readings) => {
            if (readingError) {
                console.error('Error executing readingsQuery:', readingError)
                return callback(readingError, null)
            }

            connection.query(
                readingchQuery,
                [userId],
                (readingchError, readingch) => {
                    if (readingchError) {
                        console.error(
                            'Error executing readingchQuery:',
                            readingchError
                        )
                        return callback(readingchError, null)
                    }

                    const userIdsFromReviews = [
                        ...new Set(reviews.map((review) => review.userId)),
                    ]
                    const userIdsFromReadings = [
                        ...new Set(readings.map((reading) => reading.userId)),
                    ]
                    const allUserIds = [
                        ...new Set([
                            ...userIdsFromReviews,
                            ...userIdsFromReadings,
                        ]),
                    ]

                    if (allUserIds.length === 0) {
                        callback(null, { reviews, readings: [], readingch })
                    } else {
                        const userQuery = `
                        SELECT id, lastName, firstName 
                        FROM user 
                        WHERE id IN (?)
                    `
                        connection.query(
                            userQuery,
                            [allUserIds],
                            (userError, users) => {
                                if (userError) {
                                    console.error(
                                        'Error executing userQuery:',
                                        userError
                                    )
                                    return callback(userError, null)
                                }

                                reviews.forEach((review) => {
                                    const associatedUser = users.find(
                                        (user) => user.id === review.userId
                                    )
                                    if (associatedUser) {
                                        review.user = {
                                            id: associatedUser.id,
                                            lastName: associatedUser.lastName,
                                            firstName: associatedUser.firstName,
                                        }
                                    }
                                })

                                readings.forEach((reading) => {
                                    const associatedUser = users.find(
                                        (user) => user.id === reading.userId
                                    )
                                    if (associatedUser) {
                                        reading.user = {
                                            id: associatedUser.id,
                                            lastName: associatedUser.lastName,
                                            firstName: associatedUser.firstName,
                                        }
                                    }
                                })

                                callback(null, { reviews, readings, readingch })
                            }
                        )
                    }
                }
            )
        })
    })
}


const handleMainRequest = (req, res) => {
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

        getIdUser(email, (err, idResult) => {
            if (err) {
                console.log('here1')
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Internal Server Error' }))
                return
            }

            if (!idResult || idResult.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'User not found' }))
                return
            }

            const id = idResult[0].id
            getDetailsAndUpdates(id, (error, results) => {
                if (error) {
                    console.log('here2')
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Internal Server Error' }))
                    return
                }

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(results))
            })
        })
    } catch (error) {
        console.log('here3')
        console.error('Error:', error.message)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Internal Server Error' }))
    }
}

function getTokenFromCookie(req) {
    const cookies = req.headers.cookie
    if (cookies) {
        const parsedCookies = cookie.parse(cookies)
        return parsedCookies.token
    }
    return null
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

module.exports = {
    handleMainPage,
    handleMainRequest,
}
