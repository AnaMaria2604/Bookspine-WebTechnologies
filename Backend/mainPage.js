const fs = require('fs')
const path = require('path')

console.log('about us page')

const handleMainPage = (req, res) => {
    const filePath = path.join(__dirname, '../Frontend/Main-Page/mainpage.html')

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
    handleMainPage,
}
