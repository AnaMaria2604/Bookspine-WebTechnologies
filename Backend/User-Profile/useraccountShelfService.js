document.addEventListener('DOMContentLoaded', () => {
    const urlParts = window.location.pathname.split('/')
    const userId = urlParts.pop() || urlParts.pop()

    fetch(`/user-account-read/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.read) {
                updateShelf('read', data.read)
            } else {
                console.error('Invalid data structure for read books')
            }
        })
        .catch((error) => {
            console.error('Error fetching read books:', error)
        })

    fetch(`/user-account-reading/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.reading) {
                updateShelf('reading', data.reading)
            } else {
                console.error('Invalid data structure for reading books')
            }
        })
        .catch((error) => {
            console.error('Error fetching reading books:', error)
        })

    fetch(`/user-account-wanttoread/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.wantToRead) {
                updateShelf('wantToRead', data.wantToRead)
            } else {
                console.error('Invalid data structure for want-to-read books')
            }
        })
        .catch((error) => {
            console.error('Error fetching want-to-read books:', error)
        })
})

function updateShelf(shelfId, books) {
    if (!Array.isArray(books)) {
        console.error('Expected an array of books')
        return
    }

    const shelf = document.getElementById(shelfId)
    // if (!shelf) {
    //     console.error(`Shelf element with ID ${shelfId} not found`)
    //     return
    // }

    books.forEach((book) => {
        if (book && book.id && book.cover) {
            const bookCover = document.createElement('img')
            const userBlob = new Blob([new Uint8Array(book.cover.data)], {
                type: 'image/jpeg',
            })
            const userImageUrl = URL.createObjectURL(userBlob)
            bookCover.src = userImageUrl
            bookCover.alt = `Book ID: ${book.id}`
            shelf.appendChild(bookCover)
        } else {
            console.error('Invalid book data:', book)
        }
    })
}
