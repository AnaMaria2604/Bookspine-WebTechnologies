document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/recommended-books')
        .then((response) => response.json())
        .then((data) => {
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

    const urlParams = new URLSearchParams(window.location.search)
    const bookId = urlParams.get('id')

    fetch(`/api/book/${bookId}`)
        .then((response) => response.json())
        .then((book) => {
            const details = document.getElementById('details_book')
            // data.forEach((book) => {
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
                <p> ${book.year}</p>
            </div>`
            details.appendChild(bookElement)
            //})
        })
        .catch((error) => {
            console.error('Error fetching books:', error)
        })

    // fetch('/api/popular-books')
    //     .then((response) => response.json())
    //     .then((data) => {
    //         const popularContainer = document.getElementById('popular-books')
    //         data.forEach((book) => {
    //             const blob = new Blob([new Uint8Array(book.cover.data)], {
    //                 type: 'image/jpeg',
    //             })
    //             const imageUrl = URL.createObjectURL(blob)
    //             const bookElement = document.createElement('div')
    //             bookElement.innerHTML = `
    //             <h3>${book.title}</h3>
    //             <p>${book.author}</p>
    //             <img src="${imageUrl}" alt="${book.title}">`
    //             popularContainer.appendChild(bookElement)
    //         }).catch((error) => {
    //             console.error('Error fetching popular books:', error)
    //         })

    //     })
})
