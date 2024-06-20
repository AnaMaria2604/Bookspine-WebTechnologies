console.log('reviewservice')

document.addEventListener('DOMContentLoaded', function () {
    const urlParts = window.location.pathname.split('/')
    const bookId = urlParts.pop() || urlParts.pop()

    fetch(`/review-book/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('page-header')
            data.forEach((book) => {
                const blob = new Blob([new Uint8Array(book.cover.data)], {
                    type: 'image/jpeg',
                })
                const imageUrl = URL.createObjectURL(blob)
                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
                <div>
                    <img class="poza" alt="" src="${imageUrl}">
                    <div class="text">
                        <div class="titlu">${book.title}</div>
                        <div class="autor">${book.author}</div>
                    </div>
                </div>`
                details.appendChild(bookElement)
            })
        })
        .catch((error) => {
            console.error('Error fetching review page:', error)
        })
})
