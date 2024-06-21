const jwt = require('jsonwebtoken')
const cookie = require('cookie')

function isUserLoggedIn(req, res) {
    const token = getTokenFromCookie(req)
    if (!token) {
        return false
    }

    const secretKey =
        'cfc1fffcd77355620d863b573349ee9cfb7b8552335aaf93e88abc52d147ef5e'
    try {
        const decodedToken = jwt.verify(token, secretKey)
        return !!decodedToken.email // Return true if email exists in decoded token
    } catch (err) {
        console.log('Error decoding token:', err.message)
        return false
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
