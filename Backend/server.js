const http = require('http')
const initializeDatabase = require('../DataBase/databasemaker')

const dbConnection = initializeDatabase()

const server = http.createServer((req, res) => {
    if (dbConnection) {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Te-ai conectat cu succes la baza de date!')
    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Eroare la conectarea la baza de date')
    }
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log('Serverul rulează.')
})
