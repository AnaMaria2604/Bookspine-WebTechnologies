
document.addEventListener('DOMContentLoaded', function () {
    const urlParts = window.location.pathname.split('/')
    const bookId = urlParts.pop() || urlParts.pop()

    const form = document.getElementById('add-to-want-to-read-form')

    form.addEventListener('submit', function (event) {
        event.preventDefault() 

        const formData = new URLSearchParams()
        formData.append('bookId', bookId)

        fetch('/addToWantToRead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.error('Error adding to want-to-read list:', error)
            })
    })

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

    fetch(`/api/book/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('description_book')
            data.forEach((book) => {
                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
                <div class="description">
                    " ${book.description} "
                </div>
                `
                details.appendChild(bookElement)
            })
        })
        .catch((error) => {
            console.error('Error fetching books:', error)
        })

    fetch(`/api/review/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('reviews')
            data.forEach((review) => {
                const userId = review.userId
                const rating = review.rating
                const descr = review.reviewDescription

                fetch(`/api/user-review/${userId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        const details = document.getElementById('review_author')
                        data.forEach((user) => {
                            const blob = new Blob(
                                [new Uint8Array(user.photo.data)],
                                {
                                    type: 'image/jpeg',
                                }
                            )
                            const imageUrl = URL.createObjectURL(blob)
                            const reviewElement = document.createElement('div')
                            reviewElement.innerHTML = `
                            <div class="item">
                                <div class="user_content">
                                    <img class="user_photo" src="${imageUrl}" alt=" "> 
                                    <a href="#">${user.lastName}'s review:  </a>
                                    <div>${rating} stars</div>
                                </div>
                                <div class="descriere">"${descr}"</div>
                            </div>
                            `
                            details.appendChild(reviewElement)
                        })
                    })
                    .catch((error) => {
                        console.error('Error fetching reviews:', error)
                    })
            })
        })
        .catch((error) => {
            console.error('Error fetching reviews:', error)
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
