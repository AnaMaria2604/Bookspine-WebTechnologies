const http = require('http')
const path = require('path')
const fs = require('fs')
const initializeDatabase = require('./DataBase/databasemaker')
const {
    handleCreateAccountRequest,
    handleCreateAccountSubmit,
} = require('./Backend/createAccount')
const { handleLoginRequest, handleLoginSubmission } = require('./Backend/login')
const { handleIndexRequest } = require('./Backend/index')
const {
    handlePopularBooksRequest,
    handleRecommendedBooksRequest,
} = require('./API/getTenBooks')

const {
    handleBookRequest,
    handleReviewRequest,
    handleUserReviewRequest,
} = require('./API/showBookDetails')

const { handlePageDetailsRequest } = require('./Backend/book')
const {
    handleFavouriteRequest,
    handleFavouriteSubmission,
} = require('./Backend/favourite')
const { Console } = require('console')

//initializeDatabase()

const server = http.createServer((req, res) => {
    // Verifică cererile pentru pagina de creare a contului
    if (req.method === 'GET' && req.url === '/create-account') {
        handleCreateAccountRequest(req, res)
    } else if (req.method === 'POST' && req.url === '/create-account') {
        handleCreateAccountSubmit(req, res)
    } else if (req.method === 'GET' && req.url === '/login') {
        handleLoginRequest(req, res)
    } else if (req.method === 'POST' && req.url === '/login') {
        handleLoginSubmission(req, res)
    } else if (req.method === 'GET' && req.url === '/') {
        handleIndexRequest(req, res)
    } else if (req.method === 'GET' && req.url === '/api/recommended-books') {
        handleRecommendedBooksRequest(req, res)
    } else if (req.method === 'GET' && req.url === '/api/popular-books') {
        handlePopularBooksRequest(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/book/')) {
        const bookId = req.url.split('/').pop()
        handlePageDetailsRequest(req, res, bookId)
    } else if (req.method === 'GET' && req.url.startsWith('/api/book/')) {
        const bookId = req.url.split('/').pop()
        handleBookRequest(req, res, bookId)
    } else if (req.method === 'GET' && req.url === '/favourite-genres') {
        handleFavouriteRequest(req, res)
    } else if (req.method === 'POST' && req.url === '/favourite-submission') {
        handleFavouriteSubmission(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/api/review/')) {
        const bookId = req.url.split('/').pop()
        handleReviewRequest(req, res, bookId)
    } else if (
        req.method === 'GET' &&
        req.url.startsWith('/api/user-review/')
    ) {
        const userId = req.url.split('/').pop()
        handleUserReviewRequest(req, res, userId)
    }

    // Verifică cererile pentru fișiere CSS
    else if (req.url.startsWith('/style/')) {
        const filePath = path.join(__dirname, 'Frontend/Register-Page', req.url)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404)
                res.end('404 Not Found')
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' })
                res.end(data)
            }
        })
    }
    // Verifică cererile pentru fișierele JavaScript din Backend
    else if (req.url.startsWith('/Backend/')) {
        const filePath = path.join(__dirname, req.url)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404)
                res.end('404 Not Found')
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' })
                res.end(data)
            }
        })
    }
    // Verifică cererile pentru alte fișiere statice (HTML, JS, imagini)
    else if (req.url.startsWith('/Frontend/')) {
        const filePath = path.join(__dirname, req.url)
        const extname = path.extname(filePath).toLowerCase()
        let contentType = 'text/html'

        switch (extname) {
            case '.js':
                contentType = 'application/javascript'
                break
            case '.css':
                contentType = 'text/css'
                break
            case '.json':
                contentType = 'application/json'
                break
            case '.png':
                contentType = 'image/png'
                break
            case '.jpg':
                contentType = 'image/jpg'
                break
            case '.gif':
                contentType = 'image/gif'
                break
            case '.svg':
                contentType = 'image/svg+xml'
                break
            default:
                contentType = 'text/html'
                break
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404)
                    res.end('404 Not Found')
                } else {
                    res.writeHead(500)
                    res.end('Internal Server Error')
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(content, 'utf-8')
            }
        })
    } else {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        res.end('Not Found')
    }
})

server.listen(3000, () => {
    console.log('Server is listening on port 3000')
})
