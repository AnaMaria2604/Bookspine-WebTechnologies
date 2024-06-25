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
} = require('./Backend/getTenBooks')
const {
    handleBookRequest,
    handleReviewRequest,
    handleUserReviewRequest,
} = require('./Backend/showBookDetails')
const { handlePageDetailsRequest } = require('./Backend/book')
const {
    handleFavouriteRequest,
    handleFavouriteSubmission,
} = require('./Backend/favourite')
const {
    handleShelfWantToRead,
    handleShelfReading,
} = require('./Backend/shelfForUser')
const { handleReviewDetailsRequest } = require('./Backend/reviewBook')
const { handleBookForReviewRequest } = require('./Backend/reviewBookFunctions')
const {
    handleStatisticsRequest,
    getTop10Books,
    // getTopAuthor,
    exportCSV,
    exportDocBook,
} = require('./Backend/statistics')
const {
    handleSearchPageRequest,
    handleSearchRequest,
} = require('./Backend/search')
const { handleAboutUsPage } = require('./Backend/aboutUs')
const { handleAboutUsButton } = require('./Backend/aboutUsFunctions')
const { handleMainPage, handleMainRequest } = require('./Backend/mainPage')
const { handleReview } = require('./Backend/reviewPostFunctions')
const { Console } = require('console')
const { handleTagsRequest } = require('./Backend/tags')
const { handleGroupJoinPageRequest } = require('./Backend/groupjoin')
const {
    handleGroupRequest,
    handleGroupJoinForUser,
    handleJoin,
} = require('./Backend/groupJoinFunction')
const {
    handleGroupConvPageRequest,
    handleGroupConversationSubmit,
} = require('./Backend/groupConv')
const { handleGroupConvRequest } = require('./Backend/groupConvFunction')
const { isUserLoggedIn, verifyIfIsAdmin } = require('./Backend/loginStatus')
const { handleMyAccount } = require('./Backend/account')
const { handleUpdateBook } = require('./Backend/updateBook')
const { handleBookForUpdateRequest } = require('./Backend/updateBookFunctions')
const { handleUpdate } = require('./Backend/updatePostFunctions')
const { handleHelpPage } = require('./Backend/help')
const { handleMyBooks } = require('./Backend/mybooks')
const {
    handleAccountDetails,
    getNextGroupId,
    handleLogout,
} = require('./Backend/accountFunctions')
const {
    handleAccount,
    //handleUploadPhoto,
} = require('./Backend/accountSaveFunctions')
const { handleCreateGroup } = require('./Backend/groupCreate')
const {
    handleMyBooksRead,
    handleMyBooksCurrentlyReading,
    handleMyBooksWantToRead,
} = require('./Backend/mybooksFunction')
const { handleReadingCh } = require('./Backend/readingch')
const { handleReadingChallenges } = require('./Backend/readingchFunctions')
const { handleDeleteBtn } = require('./Backend/readingchDeteleFunctions')
const { handleupdateChallenge } = require('./Backend/readingchEditFunctions')
const { handleRSSRequest } = require('./Backend/rss')
const { handleUserAccount } = require('./Backend/User-Profile/useraccount')
const {
    handleUserDetails,
} = require('./Backend/User-Profile/useraccountFunctions')
const {
    handleShelves,
    getBooks,
} = require('./Backend/User-Profile/useraccountShelfFunctions')
const {
    getBookTitle,
    getReviewDetails,
    getReadingDetails,
} = require('./Backend/User-Profile/useraccountReviewFunctions')
const {
    handleSave,
    handleBookTitle,
} = require('./Backend/groupCreateSaveFunctions')
const { handleSettingsGroup } = require('./Backend/groupSettings')
const { handleUpdates } = require('./Backend/groupSettingsSaveFunctions')
const {
    handleAdminPageRequest,
    handleAllUsersAndGroupsRequest,
    handleDeleteUser,
    handleDeleteGroup,
} = require('./Backend/admin')
const { handleNotFoundPage } = require('./Backend/notfound')
const { handle } = require('./Backend/groupCreateListFunction')

initializeDatabase()

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/create-account') {
        handleCreateAccountRequest(req, res)
    } else if (req.method === 'POST' && req.url === '/create-account') {
        handleCreateAccountSubmit(req, res)
    } else if (req.method === 'GET' && req.url === '/login') {
        handleLoginRequest(req, res)
    } else if (req.method === 'POST' && req.url === '/login') {
        handleLoginSubmission(req, res)
    } else if (req.url === '/logout' && req.method === 'POST') {
        handleLogout(req, res)
    } else if (req.method === 'GET' && req.url === '/') {
        handleIndexRequest(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/user-account/')) {
        const userId = req.url.split('/').pop()
        handleUserAccount(req, res, userId)
    } else if (
        req.method === 'GET' &&
        req.url.startsWith('/user-account-details/')
    ) {
        const userId = req.url.split('/').pop()
        handleUserDetails(req, res, userId)
    } else if (
        req.method === 'GET' &&
        req.url.startsWith('/user-account-read/')
    ) {
        const userId = req.url.split('/').pop()
        getBooks('alreadyread', userId, (error, covers) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Internal Server Error' }))
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ read: covers }))
            }
        })
    } else if (
        req.method === 'GET' &&
        req.url.startsWith('/user-account-reading/')
    ) {
        const userId = req.url.split('/').pop()
        getBooks('reading', userId, (error, covers) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Internal Server Error' }))
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ reading: covers }))
            }
        })
    } else if (
        req.method === 'GET' &&
        req.url.startsWith('/user-account-wanttoread/')
    ) {
        const userId = req.url.split('/').pop()
        getBooks('wanttoread', userId, (error, covers) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Internal Server Error' }))
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ wantToRead: covers }))
            }
        })
    } else if (req.url.startsWith('/user-account-reviews/')) {
        const userId = req.url.split('/').pop()
        getReviewDetails(userId, (error, details) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Internal Server Error' }))
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ reviews: details }))
            }
        })
    } else if (req.url.startsWith('/user-account-reading-details/')) {
        const userId = req.url.split('/').pop()
        getReadingDetails(userId, (error, details) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Internal Server Error' }))
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ readingDetails: details }))
            }
        })
    } else if (req.method === 'GET' && req.url.startsWith('/mybooks/')) {
        if (isUserLoggedIn(req)) handleMyBooks(req, res)
        else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
    } else if (req.method === 'GET' && req.url === '/api/recommended-books') {
        handleRecommendedBooksRequest(req, res)
    } else if (req.method === 'GET' && req.url === '/api/popular-books') {
        handlePopularBooksRequest(req, res)
    } else if (
        req.method === 'POST' &&
        req.url.startsWith('/api/add-user-to-group')
    ) {
        handleJoin(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/book/')) {
        const bookId = req.url.split('/').pop()
        handlePageDetailsRequest(req, res, bookId)
    } else if (req.method === 'GET' && req.url === '/readingch') {
        if (isUserLoggedIn(req)) handleReadingCh(req, res)
        else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
    } else if (req.method === 'GET' && req.url === '/reading-details') {
        handleReadingChallenges(req, res)
    } else if (req.method === 'POST' && req.url === '/delete-challenge') {
        handleDeleteBtn(req, res)
    } else if (req.method === 'POST' && req.url === '/update-challenge') {
        handleupdateChallenge(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/api/book/')) {
        const bookId = req.url.split('/').pop()
        handleBookRequest(req, res, bookId)
    } else if (req.method === 'GET' && req.url === '/favourite-genres') {
        if (isUserLoggedIn(req)) handleFavouriteRequest(req, res)
        else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
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
    } else if (req.method === 'POST' && req.url === '/addToWantToRead') {
        handleShelfWantToRead(req, res)
    } else if (req.method === 'POST' && req.url === '/addToReading') {
        handleShelfReading(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/review-bookId/')) {
        if (isUserLoggedIn(req)) handleReviewDetailsRequest(req, res)
        else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
    } else if (req.method === 'GET' && req.url.startsWith('/review-book/')) {
        const bookId = req.url.split('/').pop()
        handleBookForReviewRequest(req, res, bookId)
    } else if (req.method === 'GET' && req.url.startsWith('/aboutUs')) {
        handleAboutUsPage(req, res)
    } else if (req.method === 'GET' && req.url === '/account') {
        if (isUserLoggedIn(req)) handleMyAccount(req, res)
        else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
    } else if (req.method === 'GET' && req.url === '/accountDetails') {
        handleAccountDetails(req, res)
    } else if (req.method === 'POST' && req.url === '/saveDetails') {
        handleAccount(req, res)
    } else if (req.method === 'POST' && req.url.startsWith('/post-review')) {
        handleReview(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/about-us-button')) {
        handleAboutUsButton(req, res)
    } else if (req.method === 'GET' && req.url === '/statistics') {
        handleStatisticsRequest(req, res)
    } else if (req.method === 'GET' && req.url === '/mainpage') {
        if (isUserLoggedIn(req)) {
            verifyIfIsAdmin(req, (error, adminEmail) => {
                if (error) {
                    console.error('Error:', error)
                } else if (adminEmail) {
                    res.writeHead(302, { Location: '/admin' })
                    res.end()
                } else {
                    handleMainPage(req, res)
                }
            })
        } else {
            res.writeHead(302, { Location: '/' })
            res.end()
        }
    } else if (req.method === 'GET' && req.url === '/api/mainpage') {
        handleMainRequest(req, res)
    } else if (req.method === 'GET' && req.url === '/help') {
        handleHelpPage(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/book-update/')) {
        if (isUserLoggedIn(req)) handleUpdateBook(req, res)
        else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
    } else if (req.method === 'GET' && req.url.startsWith('/update/')) {
        const bookId = req.url.split('/').pop()
        handleBookForUpdateRequest(req, res, bookId)
    } else if (req.method === 'POST' && req.url.startsWith('/post-update')) {
        handleUpdate(req, res)
    }
    // else if (req.url === '/uploadPhoto' && req.method === 'POST') {
    //     handleUploadPhoto(req, res)
    // }
    else if (req.url === '/top10books' && req.method === 'GET') {
        getTop10Books((err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(
                    JSON.stringify({ error: 'Failed to fetch top 10 books' })
                )
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(data))
            }
        })
    } else if (req.url === '/export/csv' && req.method === 'GET') {
        getTop10Books((err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Failed to export CSV' }))
            } else {
                exportCSV(data, 'top10books.csv', res)
            }
        })
    } else if (req.url === '/export/docbook' && req.method === 'GET') {
        getTop10Books((err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Failed to export DocBook' }))
            } else {
                exportDocBook(data, 'top10books.xml', res)
            }
        })
    } else if (req.url.startsWith('/search') && req.method === 'GET') {
        handleSearchPageRequest(req, res)
    } else if (req.url.startsWith('/api/search') && req.method === 'GET') {
        handleSearchRequest(req, res)
    } else if (req.url === '/api/tags' && req.method === 'GET') {
        handleTagsRequest(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/group/')) {
        handleGroupJoinPageRequest(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/create-group/')) {
        if (isUserLoggedIn(req)) handleCreateGroup(req, res)
        else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
    } else if (req.method === 'POST' && req.url === '/save-created-group') {
        handleSave(req, res)
    } else if (req.method === 'GET' && req.url.startsWith('/settings-group/')) {
        if (isUserLoggedIn(req)) handleSettingsGroup(req, res)
        else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
    } else if (req.method === 'POST' && req.url === '/update-group-settings') {
        handleUpdates(req, res)
    } else if (req.url === '/nextGroupId' && req.method === 'GET') {
        getNextGroupId((err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(
                    JSON.stringify({ error: 'Failed to get next group ID' })
                )
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(data))
            }
        })
    } else if (req.method === 'GET' && req.url.startsWith('/api/group/')) {
        const groupId = req.url.split('/').pop()
        handleGroupRequest(req, res, groupId)
    } else if (req.method === 'GET' && req.url.startsWith('/group-conv/')) {
        const parts = req.url.split('/')
        const groupId = parts[2]
        const bookId = parts[3]
        if (bookId == null || groupId == null) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/html')
            handleNotFoundPage(req, res)
            return
        }
        if (isUserLoggedIn(req)) handleGroupConvPageRequest(req, res)
        else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
    } else if (req.method === 'POST' && req.url.startsWith('/group-conv/')) {
        console.log('herereeee')
        const parts = req.url.split('/')
        const groupId = parts[2]
        const bookId = parts[3]
        console.log(groupId)
        console.log(bookId)
        if (bookId == null || groupId == null) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/html')
            handleNotFoundPage(req, res)
            return
        }
        if (isUserLoggedIn(req))
            handleGroupConversationSubmit(req, res, bookId, groupId)
        else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
    } else if (req.method === 'GET' && req.url.startsWith('/api/group-conv/')) {
        const parts = req.url.split('/')
        const groupId = parts[3]
        const bookId = parts[4]
        handleGroupConvRequest(req, res, bookId, groupId)
    } else if (req.url === '/api/check-auth') {
        const loggedIn = isUserLoggedIn(req)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ isAuthenticated: loggedIn }))
    } else if (req.method === 'GET' && req.url === '/api/mybooks/read') {
        handleMyBooksRead(req, res)
    } else if (
        req.method === 'GET' &&
        req.url === '/api/mybooks/currently-reading'
    ) {
        handleMyBooksCurrentlyReading(req, res)
    } else if (
        req.method === 'GET' &&
        req.url === '/api/mybooks/want-to-read'
    ) {
        handleMyBooksWantToRead(req, res)
    } else if (req.url === '/rss') {
        handleRSSRequest(req, res)
    } //trebuie buton
    else if (req.method === 'GET' && req.url === '/admin') {
        if (isUserLoggedIn(req)) {
            if (isUserLoggedIn(req)) {
                verifyIfIsAdmin(req, (error, adminEmail) => {
                    if (error) {
                        console.error('Error:', error)
                        res.writeHead(500, { 'Content-Type': 'text/plain' })
                        res.end('Internal Server Error')
                    } else if (adminEmail) {
                        handleAdminPageRequest(req, res)
                    } else {
                        res.writeHead(302, { Location: '/mainpage' })
                        res.end()
                    }
                })
            }
        } else {
            res.writeHead(302, { Location: '/login' })
            res.end()
        }
    } else if (req.url === '/getbooks') {
        handle(req, res)
    } else if (req.method === 'GET' && req.url === '/admin') {
        handleAdminPageRequest(req, res)
    } else if (req.method === 'GET' && req.url === '/all-users-groups') {
        handleAllUsersAndGroupsRequest(req, res)
    } else if (req.method === 'DELETE' && req.url.startsWith('/delete/user/')) {
        const userId = req.url.split('/').pop()
        handleDeleteUser(req, res, userId)
    } else if (
        req.method === 'DELETE' &&
        req.url.startsWith('/delete/group/')
    ) {
        const groupId = req.url.split('/').pop()
        handleDeleteGroup(req, res, groupId)
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
        res.setHeader('Content-Type', 'text/html')
        handleNotFoundPage(req, res)
    }
})

server.listen(3000, () => {
    console.log('Server is listening on port 3000')
})
