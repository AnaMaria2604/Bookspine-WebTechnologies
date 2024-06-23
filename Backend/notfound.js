const fs = require('fs')
const path = require('path')
const handleNotFoundPage = (req, res) => {
    const filePath = path.join(
        __dirname,
        '../Frontend/Not-Found-Page/notfound.html'
    )

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error loading 404 page:', err)
            res.end('Page Not Found')
        } else {
            res.end(data)
        }
    })
}
module.exports = { handleNotFoundPage }
