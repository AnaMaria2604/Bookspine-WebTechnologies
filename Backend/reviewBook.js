const fs = require('fs')
const path = require('path')

console.log('reviewbook')

const handleReviewDetailsRequest = (req, res, bookId) => {
    const filePath = path.join(__dirname, '../Frontend/Review-Page/review.html')

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
    handleReviewDetailsRequest,
}
