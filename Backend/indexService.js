console.log('indexService')
document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/recommended-books')
        .then((response) => response.json())
        .then((data) => {
            console.log('gere')
            const recommendedContainer =
                document.getElementById('recommended_books')
            data.forEach((book) => {
                console.log(book.cover)
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
                        <a href="#">${book.title}</a>
                        <a href="#">${book.author}<a>
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
            console.log('gere2')
            const popularContainer = document.getElementById('popular_books')
            data.forEach((book) => {
                console.log(book.cover)
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
                        <a href="#">${book.title}</a>
                        <a href="#">${book.author}<a>
                    </div>
                </div>`
                popularContainer.appendChild(bookElement)
            })
        })

        .catch((error) => {
            console.error('Error fetching recommended books:', error)
        })
})
