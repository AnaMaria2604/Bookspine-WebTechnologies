document.addEventListener('DOMContentLoaded', () => {
    const urlParts = window.location.pathname.split('/')
    const userId = urlParts.pop() || urlParts.pop()

    fetch(`/user-account-reviews/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.reviews) {
                updateReviews('reviews', data.reviews)
            } else {
                console.error('Invalid data structure for reviews')
            }
        })
        .catch((error) => {
            console.error('Error fetching reviews:', error)
        })

    fetch(`/user-account-reading-details/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.readingDetails) {
                updateReadingDetails('readingDetails', data.readingDetails)
            } else {
                console.error('Invalid data structure for reading details')
            }
        })
        .catch((error) => {
            console.error('Error fetching reading details:', error)
        })
})

function updateReviews(shelfId, reviews) {
    if (!Array.isArray(reviews)) {
        console.error('Expected an array of reviews')
        return
    }

    const shelf = document.getElementById(shelfId)
    if (!shelf) {
        console.error(`Shelf element with ID ${shelfId} not found`)
        return
    }

    reviews.forEach((review) => {
        if (
            review &&
            review.title &&
            review.reviewDescription &&
            review.rating
        ) {
            const reviewText = document.createElement('p')
            reviewText.textContent = `->Review la cartea ${review.title}, cu ratingul: ${review.rating} si cu descrierea: "${review.reviewDescription}".`
            shelf.appendChild(reviewText)
        } else {
            console.error('Invalid review data:', review)
        }
    })
}

function updateReadingDetails(shelfId, readingDetails) {
    if (!Array.isArray(readingDetails)) {
        console.error('Expected an array of reading details')
        return
    }

    const shelf = document.getElementById(shelfId)
    if (!shelf) {
        console.error(`Shelf element with ID ${shelfId} not found`)
        return
    }

    readingDetails.forEach((readingDetail) => {
        if (
            readingDetail &&
            readingDetail.title &&
            readingDetail.page !== undefined &&
            readingDetail.descr
        ) {
            const readingText = document.createElement('p')
            readingText.textContent = `->Update la cartea ${readingDetail.title}, pag ${readingDetail.page}, cu descrierea: "${readingDetail.descr}".`
            shelf.appendChild(readingText)
        } else {
            console.error('Invalid reading detail data:', readingDetail)
        }
    })
}
