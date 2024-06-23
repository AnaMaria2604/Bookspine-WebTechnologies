const fs = require('fs')
const path = require('path')

function handleUserAccount(req, res, userId) {
    const filePath = path.join(
        __dirname,
        '../../Frontend/User-Profile-Page/userprofile.html'
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
module.exports = {
    handleUserAccount,
}
