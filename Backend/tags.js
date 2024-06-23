const pool = require('../DataBase/database')
function handleTagsRequest(req, res) {
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

        // Variabile pentru a stoca rezultatele
        let genreResults,
            authorResults,
            publisherResults,
            publicationYearResults,
            collectionYearResults,
            editionResults
        let queriesCompleted = 0

        const checkAndRespond = () => {
            queriesCompleted++
            if (queriesCompleted === 6) {
                // Avem 5 interogări
                connection.release()
                const result = {
                    categories: genreResults.map((row) => row.genre),
                    authors: authorResults.map((row) => row.author),
                    publishers: publisherResults.map((row) => row.publisher),
                    publicationYears: publicationYearResults.map(
                        (row) => row.year
                    ),
                    collections: collectionYearResults.map(
                        (row) => row.collection
                    ),
                    editions: editionResults.map((row) => row.edition),
                }
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(result))
            }
        }

        // Interogare pentru cărți
        const genreQuery = `SELECT DISTINCT genre FROM book`
        const authorQuery = 'SELECT DISTINCT author FROM book'
        const publisherQuery = 'SELECT DISTINCT publisher FROM book'
        const publicationYearQuery = 'SELECT DISTINCT year FROM book'
        const collectionYearQuery = 'SELECT DISTINCT collection FROM book'
        const editionQuery = 'SELECT DISTINCT edition FROM book'

        connection.query(genreQuery, (err, results) => {
            if (err) {
                connection.release()
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Failed to query genres' }))
                return
            }
            genreResults = results
            checkAndRespond()
        })

        connection.query(authorQuery, (err, results) => {
            if (err) {
                connection.release()
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Failed to query authors' }))
                return
            }
            authorResults = results
            checkAndRespond()
        })

        connection.query(publisherQuery, (err, results) => {
            if (err) {
                connection.release()
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Failed to query publishers' }))
                return
            }
            publisherResults = results
            checkAndRespond()
        })

        connection.query(publicationYearQuery, (err, results) => {
            if (err) {
                connection.release()
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(
                    JSON.stringify({
                        error: 'Failed to query publication years',
                    })
                )
                return
            }
            publicationYearResults = results
            checkAndRespond()
        })

        connection.query(collectionYearQuery, (err, results) => {
            if (err) {
                connection.release()
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(
                    JSON.stringify({ error: 'Failed to query collections' })
                )
                return
            }
            collectionYearResults = results
            checkAndRespond()
        })
        connection.query(editionQuery, (err, results) => {
            if (err) {
                connection.release()
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(
                    JSON.stringify({ error: 'Failed to query collections' })
                )
                return
            }
            editionResults = results
            checkAndRespond()
        })
    })
}

module.exports = { handleTagsRequest }
