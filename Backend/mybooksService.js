document.addEventListener('DOMContentLoaded', () => {
    const urlParts = window.location.pathname.split('/')
    const category = urlParts.pop() || urlParts.pop()
    if (category === 'read') {
        fetch('/api/mybooks/read')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then((data) => {
                const booksContainer =
                    document.getElementById('books-container')

                data.books.forEach((book, index) => {
                    const bookBox = document.createElement('div')
                    bookBox.classList.add('book-box')

                    const coverImage = document.createElement('img')
                    const blob = new Blob([new Uint8Array(book.cover.data)], {
                        type: 'image/jpeg',
                    })
                    const imageUrl = URL.createObjectURL(blob)
                    coverImage.src = imageUrl
                    coverImage.alt = book.title
                    coverImage.classList.add('book-cover')
                    bookBox.appendChild(coverImage)

                    const bookDetails = document.createElement('ul')
                    bookDetails.classList.add('book-details')

                    const titleItem = document.createElement('li')
                    titleItem.textContent = `Title: ${book.title}`
                    bookDetails.appendChild(titleItem)

                    const authorItem = document.createElement('li')
                    authorItem.textContent = `Author: ${book.author}`
                    bookDetails.appendChild(authorItem)

                    const genreItem = document.createElement('li')
                    genreItem.textContent = `Genre: ${book.genre}`
                    bookDetails.appendChild(genreItem)

                    const ratingItem = document.createElement('li')
                    ratingItem.textContent = `Rating: ${book.rating}`
                    bookDetails.appendChild(ratingItem)

                    const yearItem = document.createElement('li')
                    yearItem.textContent = `Year: ${book.year}`
                    bookDetails.appendChild(yearItem)

                    const publisherItem = document.createElement('li')
                    publisherItem.textContent = `Publisher: ${book.publisher}`
                    bookDetails.appendChild(publisherItem)

                    const collectionItem = document.createElement('li')
                    collectionItem.textContent = `Collection: ${book.collection}`
                    bookDetails.appendChild(collectionItem)

                    const dateReadItem = document.createElement('li')
                    dateReadItem.textContent = `Date Read: ${new Date(
                        data.dates[index]
                    ).toLocaleDateString()}`
                    bookDetails.appendChild(dateReadItem)

                    // Adaugă lista cu detaliile în containerul pentru carte
                    bookBox.appendChild(bookDetails)
                    booksContainer.appendChild(bookBox)
                })
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    } else if (category == 'currently-reading') {
        fetch('/api/mybooks/currently-reading')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then((data) => {
                const booksContainer =
                    document.getElementById('books-container')

                data.books.forEach((book, index) => {
                    const bookBox = document.createElement('div')
                    bookBox.classList.add('book-box')
                    const coverImage = document.createElement('img')
                    const blob = new Blob([new Uint8Array(book.cover.data)], {
                        type: 'image/jpeg',
                    })
                    const imageUrl = URL.createObjectURL(blob)
                    coverImage.src = imageUrl
                    coverImage.alt = book.title
                    coverImage.classList.add('book-cover')
                    bookBox.appendChild(coverImage)

                
                    const bookDetails = document.createElement('ul')
                    bookDetails.classList.add('book-details')

                    const titleItem = document.createElement('li')
                    titleItem.textContent = `Title: ${book.title}`
                    bookDetails.appendChild(titleItem)

                    const authorItem = document.createElement('li')
                    authorItem.textContent = `Author: ${book.author}`
                    bookDetails.appendChild(authorItem)

                    const genreItem = document.createElement('li')
                    genreItem.textContent = `Genre: ${book.genre}`
                    bookDetails.appendChild(genreItem)

                    const ratingItem = document.createElement('li')
                    ratingItem.textContent = `Rating: ${book.rating}`
                    bookDetails.appendChild(ratingItem)

                    const yearItem = document.createElement('li')
                    yearItem.textContent = `Year: ${book.year}`
                    bookDetails.appendChild(yearItem)

                    const publisherItem = document.createElement('li')
                    publisherItem.textContent = `Publisher: ${book.publisher}`
                    bookDetails.appendChild(publisherItem)

                    const collectionItem = document.createElement('li')
                    collectionItem.textContent = `Collection: ${book.collection}`
                    bookDetails.appendChild(collectionItem)

                    const pagesItem = document.createElement('li')
                    pagesItem.textContent = `Pages: ${data.pages[index]}`
                    bookDetails.appendChild(pagesItem)

                    const dateReadItem = document.createElement('li')
                    dateReadItem.textContent = `Last update of page: ${new Date(
                        data.date[index]
                    ).toLocaleDateString()}`
                    bookDetails.appendChild(dateReadItem)

                    const updateButton = document.createElement('a')
                    updateButton.href = `/book-update/${book.id}`
                    updateButton.textContent = 'Make an update on this book'
                    updateButton.classList.add('update-button')
                    bookDetails.appendChild(updateButton)

                    // Adaugă lista cu detaliile în containerul pentru carte
                    bookBox.appendChild(bookDetails)
                    booksContainer.appendChild(bookBox)
                })
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    } else if (category === 'want-to-read') {
        fetch('/api/mybooks/want-to-read')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then((data) => {
                const booksContainer =
                    document.getElementById('books-container')

                data.books.forEach((book, index) => {
                    const bookBox = document.createElement('div')
                    bookBox.classList.add('book-box')

                    const coverImage = document.createElement('img')
                    const blob = new Blob([new Uint8Array(book.cover.data)], {
                        type: 'image/jpeg',
                    })
                    const imageUrl = URL.createObjectURL(blob)
                    coverImage.src = imageUrl
                    coverImage.alt = book.title
                    coverImage.classList.add('book-cover')
                    bookBox.appendChild(coverImage)

                    // Creează lista cu detaliile cărții
                    const bookDetails = document.createElement('ul')
                    bookDetails.classList.add('book-details')

                    const titleItem = document.createElement('li')
                    titleItem.textContent = `Title: ${book.title}`
                    bookDetails.appendChild(titleItem)

                    const authorItem = document.createElement('li')
                    authorItem.textContent = `Author: ${book.author}`
                    bookDetails.appendChild(authorItem)

                    const genreItem = document.createElement('li')
                    genreItem.textContent = `Genre: ${book.genre}`
                    bookDetails.appendChild(genreItem)

                    const ratingItem = document.createElement('li')
                    ratingItem.textContent = `Rating: ${book.rating}`
                    bookDetails.appendChild(ratingItem)

                    const yearItem = document.createElement('li')
                    yearItem.textContent = `Year: ${book.year}`
                    bookDetails.appendChild(yearItem)

                    const publisherItem = document.createElement('li')
                    publisherItem.textContent = `Publisher: ${book.publisher}`
                    bookDetails.appendChild(publisherItem)

                    const collectionItem = document.createElement('li')
                    collectionItem.textContent = `Collection: ${book.collection}`
                    bookDetails.appendChild(collectionItem)

                    bookBox.appendChild(bookDetails)

                    booksContainer.appendChild(bookBox)
                })
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }
})
