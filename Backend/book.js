const fs = require('fs')
const path = require('path')
const { getBookDetails } = require('../API/showBookDetails')

const handlePageDetailsRequest = (req, res, bookId) => {
    console.log('pageee details')
    const filePath = path.join(__dirname, '../Frontend/Book-Page/bookpage.html')

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
    handlePageDetailsRequest,
}
