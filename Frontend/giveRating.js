// function handleStarClick() {
//     let stars = document.querySelectorAll('.stars span')
//     let lastRating = null

//     stars.forEach((star) => {
//         star.addEventListener('click', function () {
//             this.setAttribute('data-clicked', 'true')

//             let rating = this.getAttribute('starNumber')
//             let productId = this.parentElement.getAttribute('data-productid')
//             lastRating = { stars: rating, 'product-id': productId }

//             updateStarColorings(productId, lastRating)

//             console.log(
//                 'Last Rating Given:',
//                 lastRating.stars,
//                 'Product ID:',
//                 productId
//             )
//             //si aici bagam in baza de date ce e necesar
//         })
//     })
// }

// function updateStarColorings(productId, lastRating) {
//     let lastProductStars = document.querySelector(
//         `.stars[data-productid="${productId}"]`
//     )
//     let stars = lastProductStars.querySelectorAll('span')

//     stars.forEach((star) => {
//         star.classList.remove('selected')
//     })

//     let rating = parseInt(lastRating.stars)
//     stars.forEach((star) => {
//         if (parseInt(star.getAttribute('starNumber')) <= rating) {
//             star.classList.add('selected')
//         }
//     })
// }

// document.addEventListener('DOMContentLoaded', handleStarClick)

function handleStarClick() {
    let stars = document.querySelectorAll('.stars span')

    stars.forEach((star) => {
        star.addEventListener('click', function () {
            let rating = this.getAttribute('starNumber')
            let productId = this.parentElement.getAttribute('data-productid')

            updateStarColorings(productId, rating)

            console.log('Last Rating Given:', rating, 'Product ID:', productId)
        })
    })
}

function updateStarColorings(productId, newRating) {
    let stars = document.querySelectorAll(
        `.stars[data-productid="${productId}"] span`
    )

    stars.forEach((star) => {
        let starNumber = parseInt(star.getAttribute('starNumber'))
        if (starNumber <= newRating) {
            star.classList.add('selected')
        } else {
            star.classList.remove('selected')
        }
    })
}

document.addEventListener('DOMContentLoaded', handleStarClick)
