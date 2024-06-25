document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/recommended-books')
        .then((response) => response.json())
        .then((data) => {
            const recommendedContainer =
                document.getElementById('recommended_books')
            data.forEach((book) => {
                const blob = new Blob([new Uint8Array(book.cover.data)], {
                    type: 'image/jpeg',
                })
                const imageUrl = URL.createObjectURL(blob)

                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
                <div class="carte">
                    <div class="carte__poza">
                        <img src="${imageUrl}" alt="${book.title}">
                    </div>
                    <div class="carte__text">
                        <a href="/book/${book.id}">${book.title}</a>
                        <a href="/book/${book.id}">${book.author}<a>
                    </div>
                </div>`
                recommendedContainer.appendChild(bookElement)
            })
        })

        .catch((error) => {
            console.error('Error fetching recommended books:', error)
        })
    fetch('/api/popular-books')
        .then((response) => response.json())
        .then((data) => {
            const popularContainer = document.getElementById('popular_books')
            data.forEach((book) => {
                const blob = new Blob([new Uint8Array(book.cover.data)], {
                    type: 'image/jpeg',
                })
                const imageUrl = URL.createObjectURL(blob)

                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
                <div class="carte">
                    <div class="carte__poza">
                        <img src="${imageUrl}" alt="${book.title}">
                    </div>
                    <div class="carte__text">
                        <a href="/book/${book.id}">${book.title}</a>
                        <a href="/book/${book.id}">${book.author}</a>
                    </div>
                </div>`
                popularContainer.appendChild(bookElement)
            })
        })

        .catch((error) => {
            console.error('Error fetching recommended books:', error)
        })
})
