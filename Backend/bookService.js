document.addEventListener('DOMContentLoaded', function () {
    const urlParts = window.location.pathname.split('/')
    const bookId = urlParts.pop() || urlParts.pop()
    fetch(`/api/book/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('details_book')
            data.forEach((book) => {
                const bookElement = document.createElement('div')
                console.log('Book title: ' + book.title)
                bookElement.innerHTML = `
            <div>
                <div class="title">
                    ${book.title}
                </div>
                <div class="author">
                    ${book.author}
                </div>
                <div class="genres">
                    ${book.genre}
                </div>
                <div class="published">
                    ${book.year}
                </div></div>`
                details.appendChild(bookElement)
            })
        })
        .catch((error) => {
            console.error('Error fetching books:', error)
        })
})
