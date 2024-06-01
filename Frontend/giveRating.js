document.addEventListener('DOMContentLoaded', () => {
    let stars = document.getElementsByClassName('star')

    function coloringTheStars(n) {
        removeColoring()
        let cls

        for (let i = 0; i < n; i++) {
            if (n == 1) cls = 'one'
            else if (n == 2) cls = 'two'
            else if (n == 3) cls = 'three'
            else if (n == 4) cls = 'four'
            else if (n == 5) cls = 'five'
            stars[i].className = 'star ' + cls
        }
        console.log('Ratingul dat este: ' + n)
    }

    function removeColoring() {
        for (let i = 0; i < stars.length; i++) {
            stars[i].className = 'star'
        }
    }

    for (let i = 0; i < stars.length; i++) {
        stars[i].addEventListener('click', function () {
            coloringTheStars(i + 1)
        })
    }
})
