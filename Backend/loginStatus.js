const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const pool = require('../DataBase/database') // Importați pool-ul de conexiuni la baza de date

function isUserLoggedIn(req) {
    console.log('check')
    const token = getTokenFromCookie(req)
    if (!token) {
        return null // Return null if no token is found
    }

    const secretKey =
        'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
    try {
        const decodedToken = jwt.verify(token, secretKey)
        return decodedToken.email || null // Return email if valid token, otherwise null
    } catch (err) {
        console.log('Error decoding token:', err.message)
        return null // Return null if token verification fails
    }
}

function verifyIfIsAdmin(req, callback) {
    const token = getTokenFromCookie(req)

    if (!token) {
        return callback(null, false) // Return false if no token
    }

    try {
        const secretKey =
            'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
        const decodedToken = jwt.verify(token, secretKey)
        const email = decodedToken.email
        console.log(email)
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection:', err)
                return callback(err, false)
            }

            const query = 'SELECT id FROM admin WHERE email = ?'
            connection.query(query, [email], (error, results) => {
                connection.release()

                if (error) {
                    console.error('Error executing query:', error)
                    return callback(error, false)
                }

                if (results.length > 0) {
                    return callback(null, email) // Return the email if found
                } else {
                    return callback(null, false) // Return false if no admin found
                }
            })
        })
    } catch (error) {
        console.error('Error verifying token:', error)
        return callback(error, false)
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

module.exports = { isUserLoggedIn, verifyIfIsAdmin }
