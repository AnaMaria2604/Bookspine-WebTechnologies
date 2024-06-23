const jwt = require('jsonwebtoken')
const cookie = require('cookie')

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

function getTokenFromCookie(req) {
    const cookies = req.headers.cookie
    if (cookies) {
        const parsedCookies = cookie.parse(cookies)
        return parsedCookies.token
    }
    return null
}

module.exports = { isUserLoggedIn }
