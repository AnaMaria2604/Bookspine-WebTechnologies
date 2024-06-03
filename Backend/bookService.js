const fs = require('fs')
const path = require('path')
const { getBookDetails } = require('../API/showBookDetails')

function handleBookRequest(req, res, bookId) {
    getBookDetails(bookId, (error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(results))
        }
    })
}

const handlePageDetailsRequest = (req, res) => {
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
    handleBookRequest,
}
