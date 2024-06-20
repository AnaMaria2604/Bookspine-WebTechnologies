console.log('reviewservice')

document.addEventListener('DOMContentLoaded', function () {
    const urlParts = window.location.pathname.split('/')
    const bookId = urlParts.pop() || urlParts.pop()

    fetch(`/api/book/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('book-read')
            data.forEach((book) => {
                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
                <div>
                    <a href="/review-bookId/${bookId}">Read</a>
                </div>`
                details.appendChild(bookElement)
            })
        })
        .catch((error) => {
            console.error('Error fetching review page:', error)
        })
})
