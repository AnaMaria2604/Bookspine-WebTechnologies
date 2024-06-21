const fs = require('fs')
const path = require('path')

const handleGroupJoinPageRequest = (req, res) => {
    const filePath = path.join(
        __dirname,
        '../Frontend/Group-Join-Page/groupjoin.html'
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

module.exports = {
    handleGroupJoinPageRequest,
}
