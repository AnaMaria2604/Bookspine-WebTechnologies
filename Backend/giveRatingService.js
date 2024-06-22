document.addEventListener('DOMContentLoaded', () => {
    let stars = document.getElementsByClassName('star')
    const textinput = document.getElementById('textarea-text')
    const postbutton = document.getElementById('post-button')
    const date = document.getElementById('endDate')

    let currentRating = 0

    const urlParts = window.location.pathname.split('/')
    const bookId = urlParts.pop() || urlParts.pop()

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
        currentRating = n
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

    postbutton.addEventListener('click', function () {
        const reviewContent = textinput.value
        const dateContent = date.value
        
        fetch(`/post-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookId: bookId,
                rating: currentRating,
                review: reviewContent,
                endDate: dateContent,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    })
})
