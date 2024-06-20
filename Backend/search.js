const fs = require('fs')
const path = require('path')
const pool = require('../DataBase/database')
const url = require('url')
function handleSearchPageRequest(req, res) {
    const filePath = path.join(__dirname, '../Frontend/Search-Page/search.html')
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
function handleSearchRequest(req, res) {
    const parsedUrl = url.parse(req.url, true)
    const query = parsedUrl.query.q || ''
    console.log(query)
    if (!query) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Query parameter is required' }))
        return
    }

    // Obține conexiunea din pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('eroare pool')
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(
                JSON.stringify({ error: 'Failed to get database connection' })
            )
            return
        }

        // Interogare pentru cărți
        const bookQuery = `SELECT title, author, cover FROM book WHERE title LIKE ? OR author LIKE ?`
        const bookQueryValues = [`%${query}%`, `%${query}%`]

        // Interogare pentru grupuri
        const groupQuery = `SELECT teamName FROM team WHERE teamName LIKE ?`
        const groupQueryValues = [`%${query}%`]
        // Execută interogarea pentru cărți
        connection.query(bookQuery, bookQueryValues, (bookErr, bookResults) => {
            if (bookErr) {
                connection.release()
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Failed to query books' }))
                return
            }
            console.log(bookResults)
            // Execută interogarea pentru grupuri
            connection.query(
                groupQuery,
                groupQueryValues,
                (groupErr, groupResults) => {
                    connection.release()
                    if (groupErr) {
                        console.log('aicisasaa')
                        res.writeHead(500, {
                            'Content-Type': 'application/json',
                        })
                        res.end(
                            JSON.stringify({ error: 'Failed to query groups' })
                        )
                        return
                    }

                    // Verifică dacă rezultatele sunt goale
                    if (bookResults.length === 0 && groupResults.length === 0) {
                        console.log('aici')
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        })
                        res.end(JSON.stringify({ message: 'No results found' }))
                    } else {
                        // Returnează rezultatele în format JSON
                        const result = {
                            books: bookResults,
                            groups: groupResults,
                        }
                        console.log(result.books)

                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        })
                        res.end(JSON.stringify(result))
                    }
                }
            )
        })
    })
}

module.exports = { handleSearchPageRequest, handleSearchRequest }
