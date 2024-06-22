const mysql = require('mysql')
const pool = require('../DataBase/database')

const generateRSS = (reviews) => {
    let rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
    <title>Recenzii de carti</title>
    <description>Ultimele recenzii pentru cărți</description>
    <link>http://localhost:3000</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>1800</ttl>`

    reviews.forEach((review) => {
        const reviewLink = `http://localhost:3000/book/${review.book.id}` // Construiește URL-ul pentru recenzia respectivă

        rssFeed += `
    <item>
        <title>${review.book.title} - Recenzie de ${review.user.lastName}  ${review.user.firstName}</title>
        <description>${review.reviewDescription}</description>
        <link>${reviewLink}</link>
        <guid>${reviewLink}</guid>
        <pubDate>${review.date}</pubDate>
    </item>`
    })

    rssFeed += `
</channel>
</rss>`

    return rssFeed
}

const handleRSSRequest = (req, res) => {
    getUpdates((error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            const rssFeed = generateRSS(results)
            res.writeHead(200, { 'Content-Type': 'application/rss+xml' })
            res.end(rssFeed)
        }
    })
}

const getUpdates = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query('SELECT * FROM review', (error, reviews) => {
            if (error) {
                connection.release()
                return callback(error, null)
            }
            // Inițializăm arrays pentru a stoca promisunile pentru utilizatori și cărți
            const userPromises = []
            const bookPromises = []

            // Mapăm recenziile pentru a crea promisuni pentru interogările utilizatorilor și cărților
            reviews.forEach((review) => {
                userPromises.push(
                    new Promise((resolve, reject) => {
                        connection.query(
                            'SELECT * FROM user WHERE id = ?',
                            [review.userId],
                            (userError, userResults) => {
                                if (userError) return reject(userError)
                                resolve({
                                    ...review,
                                    user: userResults[0],
                                })
                            }
                        )
                    })
                )

                bookPromises.push(
                    new Promise((resolve, reject) => {
                        connection.query(
                            'SELECT * FROM book WHERE id = ?',
                            [review.bookId],
                            (bookError, bookResults) => {
                                if (bookError) return reject(bookError)
                                resolve({
                                    ...review,
                                    book: bookResults[0],
                                })
                            }
                        )
                    })
                )
            })

            // Așteptăm ca toate promisunile să fie rezolvate
            Promise.all(userPromises)
                .then((userReviews) => {
                    Promise.all(bookPromises)
                        .then((bookReviews) => {
                            // Combinăm informațiile utilizatorilor și cărților
                            const combinedReviews = userReviews.map(
                                (review, index) => ({
                                    ...review,
                                    book: bookReviews[index].book,
                                })
                            )
                            connection.release() // eliberăm conexiunea doar aici
                            callback(null, combinedReviews)
                        })
                        .catch((bookError) => {
                            connection.release() // eliberăm conexiunea doar aici
                            callback(bookError, null)
                        })
                })
                .catch((userError) => {
                    connection.release() // eliberăm conexiunea doar aici
                    callback(userError, null)
                })
        })
    })
}

module.exports = { handleRSSRequest }
