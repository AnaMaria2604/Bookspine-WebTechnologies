document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input')
    const searchButton = document.getElementById('search-button')

    const performSearch = () => {
        const query = searchInput.value
        if (query) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`
        }
    }

    searchButton.addEventListener('click', () => {
        performSearch()
    })

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch()
        }
    })
})
