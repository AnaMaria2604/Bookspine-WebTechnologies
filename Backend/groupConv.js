const fs = require('fs')
const path = require('path')
const pool = require('../DataBase/database')
const { isUserLoggedIn } = require('../Backend/loginStatus')
const querystring = require('querystring') // Importăm modulul querystring pentru a parsa datele URL-encoded

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

const postReview = (groupId, bookId, userId, text, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query(
            'INSERT INTO teamconv (teamId, userId, bookId, text) VALUES (?, ?, ?, ?)',
            [groupId, userId, bookId, text],
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

const handleGroupConvPageRequest = (req, res) => {
    const filePath = path.join(
        __dirname,
        '../Frontend/Group-Conversation-Page/groupconv.html'
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

const handleGroupConversationSubmit = (req, res, bookId, groupId) => {
    console.log('In handleGroupConversationSubmit')
    console.log('groupId:', groupId)
    console.log('bookId:', bookId)
    let body = ''

    // Ascultăm evenimentul 'data' pentru a colecta corpul cererii
    req.on('data', (chunk) => {
        body += chunk.toString()
    })

    // Ascultăm evenimentul 'end' pentru a procesa datele colectate
    req.on('end', async () => {
        try {
            const formData = querystring.parse(body) // Parsăm corpul cererii URL-encoded
            const { review: text } = formData

            // Verificăm dacă utilizatorul este autentificat
            const userEmail = await isUserLoggedIn(req) // Presupunând că isUserLoggedIn primește req

            if (!userEmail) {
                throw new Error('User not authenticated')
            }

            // Obținem ID-ul utilizatorului pe baza email-ului
            getIdUser(userEmail, (err, result) => {
                if (err) {
                    console.error('Error getting user ID:', err)
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ error: 'Error getting user ID.' }))
                    return
                }

                const idUser = result[0].id // Presupunând că obții ID-ul utilizatorului din rezultat

                // Presupunând că ai o funcție postReview care inserează recenzia în baza de date
                postReview(groupId, bookId, idUser, text, (error, results) => {
                    if (error) {
                        console.error('Error posting review:', error)
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
            })
        } catch (error) {
            console.error('Error processing request:', error)
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Bad Request' }))
        }
    })
}

module.exports = { handleGroupConvPageRequest, handleGroupConversationSubmit }
