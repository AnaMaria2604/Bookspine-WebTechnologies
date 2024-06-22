const mysql = require('mysql')
const pool = require('../DataBase/database')

const generateRSS = (reviews, readings) => {
    let rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
    <title>Recenzii și Lecturi</title>
    <description>Ultimele recenzii pentru cărți și lecturi</description>
    <link>http://localhost:3000</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>1800</ttl>`

    // Adăugăm noutățile pentru recenzii
    reviews.forEach((review) => {
        const reviewLink = `http://localhost:3000/book/${review.bookId}` // Link-ul pentru recenzie

        rssFeed += `
    <item>
        <title>${review.bookTitle} - Recenzie de ${review.user.lastName} ${
            review.user.firstName
        }</title>
        <description>${review.reviewDescription}</description>
        <link>${reviewLink}</link>
        <guid>${reviewLink}</guid> <!-- Folosește linkul recenziei ca și GUID -->
        <pubDate>${new Date(review.date).toUTCString()}</pubDate>
    </item>`
    })

    // Adăugăm noutățile pentru lecturi
    readings.forEach((reading) => {
        const readingLink = `http://localhost:3000/user-account/${reading.userId}` // Link-ul pentru lectură

        rssFeed += `
    <item>
        <title>Lectură: ${reading.bookTitle} - Citită de ${
            reading.user.lastName
        } ${reading.user.firstName}</title>
        <description>${reading.descr}</description>
        <link>${readingLink}</link>
        <guid>${readingLink}</guid> <!-- Folosește linkul lecturii ca și GUID -->
        <pubDate>${new Date(reading.updateDate).toUTCString()}</pubDate>
    </item>`
    })

    rssFeed += `
</channel>
</rss>`

    return rssFeed
}

const getUpdates = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }

        // Interogare pentru a obține toate recenziile din tabela reviews
        connection.query(
            'SELECT review.*, book.title AS bookTitle FROM review INNER JOIN book ON review.bookId = book.id',
            (error, reviews) => {
                if (error) {
                    connection.release()
                    return callback(error, null)
                }

                // Interogare pentru a obține toate lecturile din tabela reading
                connection.query(
                    'SELECT reading.*, book.title AS bookTitle FROM reading INNER JOIN book ON reading.bookId = book.id',
                    (readingError, readings) => {
                        if (readingError) {
                            connection.release()
                            return callback(readingError, null)
                        }

                        // Obținem ID-urile unice ale utilizatorilor din recenzii și lecturi
                        const userIdsFromReviews = [
                            ...new Set(reviews.map((review) => review.userId)),
                        ]
                        const userIdsFromReadings = [
                            ...new Set(
                                readings.map((reading) => reading.userId)
                            ),
                        ]

                        // Unim ID-urile unice ale utilizatorilor din ambele seturi
                        const allUserIds = [
                            ...new Set([
                                ...userIdsFromReviews,
                                ...userIdsFromReadings,
                            ]),
                        ]

                        if (allUserIds.length === 0) {
                            // Dacă nu există utilizatori, eliberăm conexiunea și apelăm callback-ul cu rezultatele goale pentru lecturi
                            connection.release()
                            callback(null, { reviews, readings: [] })
                        } else {
                            // Interogare pentru a obține informațiile utilizatorilor (doar id, lastName, firstName)
                            connection.query(
                                'SELECT id, lastName, firstName FROM user WHERE id IN (?)',
                                [allUserIds],
                                (userError, users) => {
                                    if (userError) {
                                        connection.release()
                                        return callback(userError, null)
                                    }

                                    // Mapăm utilizatorii la recenzii
                                    reviews.forEach((review) => {
                                        const associatedUser = users.find(
                                            (user) => user.id === review.userId
                                        )
                                        if (associatedUser) {
                                            review.user = {
                                                id: associatedUser.id,
                                                lastName:
                                                    associatedUser.lastName,
                                                firstName:
                                                    associatedUser.firstName,
                                            }
                                        }
                                    })

                                    // Mapăm utilizatorii la lecturi
                                    readings.forEach((reading) => {
                                        const associatedUser = users.find(
                                            (user) => user.id === reading.userId
                                        )
                                        if (associatedUser) {
                                            reading.user = {
                                                id: associatedUser.id,
                                                lastName:
                                                    associatedUser.lastName,
                                                firstName:
                                                    associatedUser.firstName,
                                            }
                                        }
                                    })

                                    // Apelăm callback-ul cu rezultatele din reviews și readings, incluzând utilizatorii asociați
                                    callback(null, { reviews, readings })
                                }
                            )
                        }
                    }
                )
            }
        )
    })
}

const handleRSSRequest = (req, res) => {
    // Apelăm funcția getUpdates pentru a obține datele actualizate
    getUpdates((error, results) => {
        if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else {
            // Extragem rezultatele pentru recenzii și lecturi
            console.log(results)
            const { reviews, readings } = results
            const rssFeed = generateRSS(reviews, readings)
            res.writeHead(200, { 'Content-Type': 'application/rss+xml' })
            res.end(rssFeed)
        }
    })
}

module.exports = { handleRSSRequest }
