document.addEventListener('DOMContentLoaded', function () {
    const urlParts = window.location.pathname.split('/')
    const bookId = urlParts.pop() || urlParts.pop()
    fetch(`/api/book/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('details_book')
            data.forEach((book) => {
                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
            <div>
                <div class="title">
                    ${book.title}
                </div>
                <div class="author">
                    by ${book.author}
                </div>
                <div class="genres">
                    Genre: ${book.genre}
                </div>
                <div class="published">
                    First published in: ${book.year}
                </div></div>`
                details.appendChild(bookElement)
            })
        })
        .catch((error) => {
            console.error('Error fetching books:', error)
        })

    fetch(`/api/book/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('book_image')
            data.forEach((book) => {
                console.log(book.cover)
                const blob = new Blob([new Uint8Array(book.cover.data)], {
                    type: 'image/jpeg',
                })
                const imageUrl = URL.createObjectURL(blob)

                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
                <div class="cover">
                    <img class="book_cover"src="${imageUrl}" alt="${book.title}">
                </div`
                details.appendChild(bookElement)
            })
        })
        .catch((error) => {
            console.error('Error fetching books:', error)
        })

    fetch(`/api/book/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('starContainer')
            data.forEach((book) => {
                const bookElement = document.createElement('div')
                bookElement.innerHTML = ` 
                <div class="showrating"></div>`
                details.appendChild(bookElement)
                showStars(book.rating)
            })
        })
        .catch((error) => {
            console.error('Error fetching books:', error)
        })

    function showStars(number) {
        if (
            typeof number !== 'number' ||
            !Number.isInteger(number) ||
            number < 1 ||
            number > 5
        ) {
            console.error('Please provide a valid integer between 1 and 5.')
            return
        }

        let starContainer = document.getElementById('starContainer')

        starContainer.innerHTML = ''

        for (let i = 1; i <= number; i++) {
            let star = document.createElement('span')
            star.textContent = '★'
            star.classList.add('gold-star')
            starContainer.appendChild(star)
        }

        for (let i = number + 1; i <= 5; i++) {
            let star = document.createElement('span')
            star.textContent = '★'
            star.classList.add('white-star')
            starContainer.appendChild(star)
        }
    }
})
