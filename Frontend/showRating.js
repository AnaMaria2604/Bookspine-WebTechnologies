function showStars(numStars) {
    let starsContainer = document.querySelector('.avgRating')

    if (starsContainer) {
        starsContainer.innerHTML = ''

        for (let i = 1; i <= numStars; i++) {
            let star = document.createElement('span')
            star.textContent = '&#9733'
            star.setAttribute('starNumber', i)
            starsContainer.appendChild(star)
        }
    } else {
        console.error('Stars container not found!')
    }
}

showStars(5)
