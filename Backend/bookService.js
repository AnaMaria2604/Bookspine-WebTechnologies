document.addEventListener('DOMContentLoaded', function () {
    const urlParts = window.location.pathname.split('/')
    const bookId = urlParts.pop() || urlParts.pop()
    console.log('bookserv')
    console.log(bookId)
    fetch(`/api/book/${bookId}`)
        .then((response) => response.json())
        .then((book) => {
            console.log(book)
            const details = document.getElementById('details_book')
            const bookElement = document.createElement('div')
            bookElement.innerHTML = `
                <div class="title">
                    <p>${book.title}</p>
                </div>
                <div class="author">
                    <p>${book.author}</p>
                </div>
                <div class="genres">
                    <p>${book.genre}</p>
                </div>
                <div class="published">
                    <p>${book.year}</p>
                </div>`
            details.appendChild(bookElement)
        })
        .catch((error) => {
            console.error('Error fetching books:', error)
        })
})
