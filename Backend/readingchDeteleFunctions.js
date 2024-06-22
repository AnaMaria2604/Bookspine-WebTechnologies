const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const pool = require('../DataBase/database')

console.log('reading ch functions')

// Funcția de ștergere a unei provocări din baza de date
const deleteChallenge = (chId, callback) => {
    console.log('id: ' + chId)
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err)
            return callback(err, null)
        }
        connection.query(
            'DELETE FROM readingchallenge WHERE id = ?',
            [chId],
            (error, results) => {
                connection.release()
                if (error) {
                    console.error('Error executing query:', error)
                    return callback(error, null)
                }
                callback(null, results)
            }
        )
    })
}

function handleDeleteBtn(req, res) {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
        console.log('Received chunk:', chunk.toString())
    })

    req.on('end', () => {
        console.log('Full request body:', body)
        try {
            const parsedBody = JSON.parse(body)
            const chId = parsedBody.id
            console.log('Challenge ID to delete:', chId)

            deleteChallenge(chId, (error, results) => {
                if (error) {
                    console.error('Error deleting challenge:', error)
                    res.writeHead(500, { 'Content-Type': 'application/json' })
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: 'Internal Server Error',
                        })
                    )
                    return
                }

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(
                    JSON.stringify({
                        success: true,
                        message: 'Challenge deleted successfully',
                    })
                )
            })
        } catch (parseError) {
            console.error('Error parsing request body:', parseError)
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(
                JSON.stringify({
                    success: false,
                    message: 'Invalid request body',
                })
            )
        }
    })
}

module.exports = {
    handleDeleteBtn,
}
