document.addEventListener('DOMContentLoaded', function () {
    fetch(`/about-us-button`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        })
        .then((data) => {
            const details = document.getElementById('buton-aboutus')

            const bookElement = document.createElement('div')
            const hrefUrl = data.status === 1 ? '/mainpage' : '/'
            bookElement.innerHTML = `
                <div class="button">
                    <a href="${hrefUrl}">Discover our home page!</a>
                </div>`
            details.appendChild(bookElement)
        })
        .catch((error) => {
            console.error('Error fetching redirect URL:', error)
        })

    console.log('buna ziua')
})
