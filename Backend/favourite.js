const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')

const getIdUser = (email, callback) => {
    console.log('here')
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
                console.log(result)
                callback(null, result)
            }
        )
    })
}

const deleteFavouriteGenres = (idUser, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }

        connection.query(
            'DELETE FROM userpreferencies WHERE userId = ?',
            [idUser],
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

const getIdsofGenres = (favouriteGenres, callback) => {
    console.log('getid')
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }

        const genreIds = []
        let remainingQueries = favouriteGenres.length
        console.log(favouriteGenres)

        for (const genreTitle of favouriteGenres) {
            console.log(`Querying for genre: ${genreTitle}`)
            connection.query(
                'SELECT id FROM genre WHERE genreTitle = ?',
                [genreTitle],
                (error, results) => {
                    if (error) {
                        connection.release()
                        return callback(error, null)
                    }

                    if (results.length > 0) {
                        genreIds.push(results[0].id)
                    } else {
                        console.log(`Genre not found: ${genreTitle}`)
                    }

                    remainingQueries--

                    if (remainingQueries === 0) {
                        connection.release()
                        console.log(genreIds)
                        callback(null, genreIds)
                    }
                }
            )
        }
    })
}

const saveFavouriteGenres = (idUser, genreIds, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }

        const queries = genreIds.map((genreId) => {
            return new Promise((resolve, reject) => {
                connection.query(
                    'INSERT INTO userpreferencies (userId, genreId) VALUES (?, ?)',
                    [idUser, genreId],
                    (error, result) => {
                        if (error) {
                            return reject(error)
                        }
                        resolve(result)
                    }
                )
            })
        })

        Promise.all(queries)
            .then((results) => {
                connection.release()
                callback(null, results)
            })
            .catch((error) => {
                connection.release()
                callback(error, null)
            })
    })
}

function handleFavouriteRequest(req, res) {
    const filePath = path.join(
        __dirname,
        '../Frontend/Favorite-Genres-Page/favoritegenres.html'
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

function handleFavouriteSubmission(req, res) {
    console.log('handleReq')
    const token = getTokenFromCookie(req)
    let email

    if (token) {
        const secretKey =
            'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err) {
                console.log('Eroare la decodarea token-ului:', err.message)
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
        const formData = querystring.parse(body)
        console.log('Form data:', formData)

        console.log('Email:', email)

        getIdUser(email, (err, result) => {
            if (err) {
                console.error(
                    'Eroare la obținerea ID-ului utilizatorului:',
                    err
                )
                return
            }

            const idUser = result[0].id
            console.log('ID utilizator:', idUser)

            deleteFavouriteGenres(idUser, (err) => {
                if (err) {
                    console.error('Eroare la ștergerea preferințelor:', err)
                    return
                }
                console.log('Preferințele au fost șterse cu succes.')

                let favouriteGenres = formData['preferinte[]']
                if (!Array.isArray(favouriteGenres)) {
                    favouriteGenres = [favouriteGenres]
                }
                console.log('Genuri favorite selectate:', favouriteGenres)

                getIdsofGenres(favouriteGenres, (err, genreIds) => {
                    if (err) {
                        console.error(
                            'Eroare la obținerea ID-urilor genurilor:',
                            err
                        )
                        return
                    }
                    console.log('ID-urile genurilor favorite:', genreIds)

                    saveFavouriteGenres(idUser, genreIds, (err, results) => {
                        if (err) {
                            console.error(
                                'Eroare la salvarea preferințelor:',
                                err
                            )
                            return
                        }
                        console.log(
                            'Preferințele au fost salvate cu succes:',
                            results
                        )

                        res.statusCode = 200
                        res.setHeader('Content-Type', 'text/plain')
                        res.end('Datele au fost primite cu succes!')
                    })
                })
            })
        })
    })
}

function getTokenFromCookie(req) {
    const cookies = req.headers.cookie
    if (cookies) {
        const parsedCookies = cookie.parse(cookies)
        const token = parsedCookies.token
        return token
    }
    return null
}

module.exports = { handleFavouriteRequest, handleFavouriteSubmission }
