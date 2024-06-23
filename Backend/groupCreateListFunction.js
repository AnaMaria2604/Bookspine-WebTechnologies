const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const querystring = require('querystring')
const pool = require('../DataBase/database')
const bcrypt = require('bcrypt')

function getBooks(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null)
        }
        connection.query('SELECT title, id FROM book', (error, result) => {
            connection.release()
            if (error) {
                return callback(error, null)
            }
            callback(null, result)
        })
    })
}

function handle(req, res) {
    getBooks((error, results) => {
        if (error) {
            console.error('Error saving details:', error)
            res.writeHead(500, {
                'Content-Type': 'application/json',
            })
            res.end(
                JSON.stringify({
                    error: 'Internal Server Error.',
                })
            )
        } else {
            res.writeHead(200, {
                'Content-Type': 'application/json',
            })
            res.end(JSON.stringify(results))
        }
    })
}

module.exports = {
    handle,
}
