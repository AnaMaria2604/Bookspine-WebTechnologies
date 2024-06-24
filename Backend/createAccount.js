const http = require('http')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { createAccount } = require('./createAccountService')
function handleCreateAccountRequest(req, res) {
    const filePath = path.join(
        __dirname,
        '../Frontend/Register-Page/registerpage.html'
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
async function handleCreateAccountSubmit(req, res) {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })
    req.on('end', async () => {
        const formData = new URLSearchParams(body)
        const firstName = formData.get('nume')
        const lastName = formData.get('prenume')
        const forgotEmail = formData.get('email')
        const password = formData.get('password')
        const confirmPassword = formData.get('confirmedPassword')
        try {
            await createAccount(
                lastName,
                firstName,
                forgotEmail,
                password,
                confirmPassword,
                res
            )
        } catch (error) {
            // console.error('Register failed:', error)

            res.setHeader('Content-Type', 'text/html')
            res.end(`
                <script>alert('${error.message}');</script>
                <script>window.location.href = "/create-account";</script>
            `)
        }
    })
}

module.exports = { handleCreateAccountRequest, handleCreateAccountSubmit }
