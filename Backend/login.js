const fs = require('fs')
const path = require('path')
const { authenticateUser } = require('./loginService')

function handleLoginRequest(req, res) {
    const filePath = path.join(
        __dirname,
        '../Frontend/Login-Page/loginpage.html'
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

function handleLoginSubmission(req, res) {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })
    req.on('end', async () => {
        const formData = new URLSearchParams(body)
        const email = formData.get('email')
        const password = formData.get('password')

        try {
            const { token, user, userType } = await authenticateUser(
                email,
                password,
                res
            )

            console.log('Authentication successful')

            res.setHeader('Content-Type', 'text/html')
            if (userType === 'user') {
                console.log("Redirecționare  de tip 'user'")
                res.writeHead(302, { Location: '/mainpage' })
                res.end()
            } else {
                console.log('Redirecționare utilizator non-user')
                res.writeHead(302, { Location: '/' })
                res.end()
            }
        } catch (error) {
            console.error('Authentication failed:', error)

            res.setHeader('Content-Type', 'text/html')
            res.end(`
                <script>alert('${error.message}');</script>
                <script>window.location.href = "/login";</script>
            `)
        }
    })
}

module.exports = { handleLoginRequest, handleLoginSubmission }
