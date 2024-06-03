const fs = require('fs')
const path = require('path')
const { getPopularBooks, getRecommendedBooks } = require('../API/getTenBooks')

function handleRecommendedBooksRequest(req, res) {
    getRecommendedBooks((error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(results))
        }
    })
}

function handlePopularBooksRequest(req, res) {
    getPopularBooks((error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(results))
        }
    })
}

const handleIndexRequest = (req, res) => {
    console.log('IndexService')
    const filePath = path.join(__dirname, '../Frontend/Index-Page/index.html')

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
    handleIndexRequest,
    handlePopularBooksRequest,
    handleRecommendedBooksRequest,
}
