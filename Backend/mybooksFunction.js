const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')

const getMyBooksRead = (id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT bookId, DATE_FORMAT(finishDate, "%Y-%m-%d") AS finishDate FROM alreadyread WHERE userId = ?',
            [id],
            (error, bookIds) => {
                if (error) {
                    connection.release()
                    return callback(error, null)
                }


                if (bookIds.length === 0) {
                    connection.release()
                    return callback(null, {
                        books: [],
                        dates: [],
                    })
                }

                // Extrage doar valorile ID-urilor
                const bookIdValues = bookIds.map((row) => row.bookId)
                const bookDates = bookIds.map((row) => row.finishDate)

                connection.query(
                    'SELECT id, cover, title, author, genre, year, rating, publisher, editor, collection FROM book WHERE id IN (?)',
                    [bookIdValues],
                    (error, bookResults) => {
                        connection.release()
                        if (error) {
                            return callback(error, null)
                        }

                        const combinedResults = {
                            books: bookResults,
                            dates: bookDates,
                        }
                        callback(null, combinedResults)
                    }
                )
            }
        )
    })
}

const getMyBooksCurrentlyReading = (id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT bookId, currentPageNumber, DATE_FORMAT(startDate, "%Y-%m-%d") AS startDate FROM reading WHERE userId = ?',
            [id],
            (error, bookIds) => {
                if (error) {
                    connection.release()
                    return callback(error, null)
                }

                if (bookIds.length === 0) {
                    connection.release()
                    return callback(null, {
                        books: [],
                        pagenr: [],
                        date: [],
                    })
                }

                
                const bookIdValues = bookIds.map((row) => row.bookId)
                const bookNrPage = bookIds.map((row) => row.currentPageNumber)
                const bookStartDate = bookIds.map((row) => row.startDate)

                connection.query(
                    'SELECT id, cover, title, author, genre, year, rating, publisher, editor, collection FROM book WHERE id IN (?)',
                    [bookIdValues],
                    (error, bookResults) => {
                        connection.release()
                        if (error) {
                            return callback(error, null)
                        }

                        const combinedResults = {
                            books: bookResults,
                            pages: bookNrPage,
                            date: bookStartDate,
                        }
                        callback(null, combinedResults)
                    }
                )
            }
        )
    })
}

const getMyBooksWantToRead = (id, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'SELECT bookId FROM wanttoread WHERE userId = ?',
            [id],
            (error, bookIds) => {
                if (error) {
                    connection.release()
                    return callback(error, null)
                }


                if (bookIds.length === 0) {
                    connection.release()
                    return callback(null, {
                        books: [],
                    })
                }

                
                const bookIdValues = bookIds.map((row) => row.bookId)

                connection.query(
                    'SELECT id,cover,title,author,genre,year,rating,publisher,editor,collection FROM book WHERE id IN (?)',
                    [bookIdValues],
                    (error, bookResults) => {
                        connection.release()
                        if (error) {
                            return callback(error, null)
                        }

                        const combinedResults = {
                            books: bookResults,
                        }
                        callback(null, combinedResults)
                    }
                )
            }
        )
    })
}
function handleMyBooksRead(req, res) {
    const token = getTokenFromCookie(req)
    let email

    if (token) {
        const secretKey =
            'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                console.log('Error decoding token:', err.message)
                return res
                    .writeHead(401, { 'Content-Type': 'application/json' })
                    .end(JSON.stringify({ error: 'Unauthorized' }))
            }
            email = decodedToken.email

            // Obține id-ul utilizatorului și apoi apelul pentru a citi cărțile
            getIdUser(email, (error, idResult) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Internal Server Error' }))
                } else {
                    const id = idResult[0].id

                    getMyBooksRead(id, (error, results) => {
                        if (error) {
                            res.writeHead(500, {
                                'Content-Type': 'application/json',
                            })
                            res.end(
                                JSON.stringify({
                                    error: 'Internal Server Error',
                                })
                            )
                        } else {
                            res.writeHead(200, {
                                'Content-Type': 'application/json',
                            })
                            res.end(JSON.stringify(results))
                        }
                    })
                }
            })
        })
    } else {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Unauthorized' }))
    }
}

function handleMyBooksCurrentlyReading(req, res) {
    const token = getTokenFromCookie(req)
    let email

    if (token) {
        const secretKey =
            'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                console.log('Error decoding token:', err.message)
                return res
                    .writeHead(401, { 'Content-Type': 'application/json' })
                    .end(JSON.stringify({ error: 'Unauthorized' }))
            }
            email = decodedToken.email

            // Obține id-ul utilizatorului și apoi apelul pentru a citi cărțile
            getIdUser(email, (error, idResult) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Internal Server Error' }))
                } else {
                    const id = idResult[0].id

                    getMyBooksCurrentlyReading(id, (error, results) => {
                        if (error) {
                            res.writeHead(500, {
                                'Content-Type': 'application/json',
                            })
                            res.end(
                                JSON.stringify({
                                    error: 'Internal Server Error',
                                })
                            )
                        } else {
                            res.writeHead(200, {
                                'Content-Type': 'application/json',
                            })
                            res.end(JSON.stringify(results))
                        }
                    })
                }
            })
        })
    } else {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Unauthorized' }))
    }
}
function handleMyBooksWantToRead(req, res) {
    const token = getTokenFromCookie(req)
    let email

    if (token) {
        const secretKey =
            'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                console.log('Error decoding token:', err.message)
                return res
                    .writeHead(401, { 'Content-Type': 'application/json' })
                    .end(JSON.stringify({ error: 'Unauthorized' }))
            }
            email = decodedToken.email

            // Obține id-ul utilizatorului și apoi apelul pentru a citi cărțile
            getIdUser(email, (error, idResult) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Internal Server Error' }))
                } else {
                    const id = idResult[0].id

                    getMyBooksWantToRead(id, (error, results) => {
                        if (error) {
                            res.writeHead(500, {
                                'Content-Type': 'application/json',
                            })
                            res.end(
                                JSON.stringify({
                                    error: 'Internal Server Error',
                                })
                            )
                        } else {
                            res.writeHead(200, {
                                'Content-Type': 'application/json',
                            })
                            res.end(JSON.stringify(results))
                        }
                    })
                }
            })
        })
    } else {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Unauthorized' }))
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
    handleMyBooksCurrentlyReading,
    handleMyBooksRead,
    handleMyBooksWantToRead,
}
