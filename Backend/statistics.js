const fs = require('fs')
const path = require('path')
const pool = require('../DataBase/database')
const createObjectCsvWriter = require('csv-writer').createObjectCsvWriter
const { create } = require('xmlbuilder2')
const handleStatisticsRequest = (req, res) => {
    const filePath = path.join(
        __dirname,
        '../Frontend/Statistics-Page/statistics.html'
    )

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

const getTop10Books = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null) // Return error if unable to get connection
        }
        connection.query(
            'SELECT id, title, author,genre,year,rating FROM book  ORDER BY rating DESC LIMIT 10',
            (error, results) => {
                connection.release() // Release connection back to the pool
                if (error) {
                    return callback(error, null) // Pass error to callback
                }
                callback(null, results) // Pass results to callback
            }
        )
    })
}
const exportCSV = (data, filename, res) => {
    if (data.length === 0) {
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment;filename=${filename}`,
        })
        res.end('')
        return
    }

    const csvWriter = createObjectCsvWriter({
        path: filename,
        header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
    })

    csvWriter
        .writeRecords(data)
        .then(() => {
            fs.readFile(filename, (err, fileData) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(
                        JSON.stringify({ error: 'Failed to read CSV file' })
                    )
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/csv',
                        'Content-Disposition': `attachment;filename=${filename}`,
                    })
                    res.end(fileData)
                }
            })
        })
        .catch((err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Failed to export CSV' }))
        })
}

const exportDocBook = (data, filename, res) => {
    const root = create().ele('book')
    data.forEach((item) => {
        const bookElem = root.ele('book')
        Object.keys(item).forEach((key) => {
            bookElem.ele(key).txt(item[key])
        })
    })

    const xml = root.end({ prettyPrint: true })
    fs.writeFileSync(filename, xml)

    res.writeHead(200, {
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment;filename=${filename}`,
    })
    res.end(xml)
}

module.exports = {
    handleStatisticsRequest,
    exportCSV,
    exportDocBook,
    getTop10Books,
}
