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

function initStars(number) {
    document.addEventListener('DOMContentLoaded', function () {
        const starContainer = document.getElementById('starContainer')
        if (!starContainer) {
            console.error('starContainer element not found.')
            return
        }
        //const number = parseInt(starContainer.getAttribute('data-number'));
        showStars(number)
    })
}
