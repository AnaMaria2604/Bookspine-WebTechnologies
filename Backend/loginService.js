const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const pool = require('../DataBase/database')

function queryDatabase(sql, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
                return
            }
            connection.query(sql, params, (err, results) => {
                connection.release()
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    })
}

async function authenticateUser(email, password, res) {
    try {
        let userType = 'user' // Default userType

        // Check in user table
        let sql = 'SELECT * FROM user WHERE email = ?'
        let rows = await queryDatabase(sql, [email])

        if (rows.length === 0) {
            // Check in admin table if user not found
            sql = 'SELECT * FROM admin WHERE email = ?'
            rows = await queryDatabase(sql, [email])
            userType = 'admin' // Update userType if admin is found
        }

        if (rows.length > 0) {
            const user = rows[0]
            const match = await bcrypt.compare(password, user.password)

            if (match) {
                const token = jwt.sign(
                    { email },
                    'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
                ) /*key*/
                // Adăugare token în antetul răspunsului HTTP
                res.setHeader('Authorization', 'Bearer ' + token)

                // Setarea cookie-ului în răspunsul HTTP
                const cookieToken = cookie.serialize('token', token, {
                    maxAge: 600, // durata de viață a cookie-ului în secunde
                    httpOnly: true,
                })
                res.setHeader('Set-Cookie', cookieToken)
                return { token, user, userType }
            } else {
                throw new Error('Incorrect password')
            }
        } else {
            throw new Error('User not found')
        }
    } catch (err) {
        console.error('Error during authentication:', err)
        throw err
    }
}

module.exports = { authenticateUser }
