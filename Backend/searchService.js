document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q')
    if (query) {
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then((response) => response.json())
            .then((data) => {
                const bookResults = document.getElementById('book-results')
                const groupResults = document.getElementById('group-results')

                // Clear previous results
                bookResults.innerHTML = ''
                groupResults.innerHTML = ''

                // Check if there are no results
                if (!data || (!data.books && !data.teams)) {
                    const noResultsMessage = document.createElement('p')
                    noResultsMessage.textContent =
                        'We do not have something with this name'
                    noResultsMessage.className = 'no-results-message'
                    bookResults.appendChild(noResultsMessage)
                    const noResultsMessage2 = document.createElement('p')
                    noResultsMessage2.textContent =
                        'We do not have something with this name'
                    noResultsMessage2.className = 'no-results-message'
                    groupResults.appendChild(noResultsMessage2)
                    return
                }

                // Populate books
                data.books.forEach((book) => {
                    const blob = new Blob([new Uint8Array(book.cover.data)], {
                        type: 'image/jpeg',
                    })
                    const imageUrl = URL.createObjectURL(blob)
                    const bookElement = document.createElement('div')
                    bookElement.className = 'mybooks__categorie'
                    bookElement.innerHTML = `
                        <img class="poza" alt="" src="${imageUrl}">
                        <div class="text__component">
                            <div class="mybooks__category">
                                <div class="categoryname"><span>${book.title}</span></div>
                                <div class="categoryauthor"><span>by ${book.author}</span></div>
                            </div>
                            <div class="group__updates">
                                <div class="text">
                                    <a href="/book/${book.id}">See more details about the book</a>
                                </div>
                            </div>
                        </div>
                    `
                    bookResults.appendChild(bookElement)
                })

                // Populate groups
                data.teams.forEach((team) => {
                    const blob = new Blob([new Uint8Array(team.photo.data)], {
                        type: 'image/jpeg',
                    })
                    const imageUrl = URL.createObjectURL(blob)
                    const groupElement = document.createElement('div')
                    groupElement.className = 'mybooks__categorie'
                    groupElement.innerHTML = `
                         <img class="poza" alt="" src="${imageUrl}">
                        <div class="mybooks__category">
                            <div class="tags">
                                <div class="categoryname"><span>${team.teamName}</span></div>
                                <div class="buton__fixat">
                                    <div class="text">
                                        <a href="/group/${team.id}">Join</a> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                    groupResults.appendChild(groupElement)
                })
            })
            .catch((error) =>
                console.error('Error fetching search results:', error)
            )
    }
    fetch('/api/tags')
        .then((response) => response.json())
        .then((data) => {
            populateTags('category-section', data.categories, 'Category')
            populateTags('author-section', data.authors, 'Authors')
            populateTags('publisher-section', data.publishers, 'Publisher')
            populateTags(
                'publication-year-section',
                data.publicationYears,
                'Publication year'
            )
            populateTags('collection-section', data.collections, 'Collections')
            populateTags('edition-section', data.editions, 'Editions')
        })
        .catch((error) => console.error('Error fetching tags:', error))
})

function populateTags(sectionId, tags, tagType) {
    const section = document.getElementById(sectionId)
    const tagsContainer = section.querySelector('.sectiune__tags')

    tags.forEach((tag) => {
        const tagElement = document.createElement('a')
        tagElement.href = `/search?q=${encodeURIComponent(tag)}`
        tagElement.textContent = tag
        tagsContainer.appendChild(tagElement)
    })
}
