document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.main')
    const top10BooksContainer = document.createElement('div')
    top10BooksContainer.id = 'top10-books'
    top10BooksContainer.className = 'top10-books-container'
    mainContainer.appendChild(top10BooksContainer)

    const csvButton = document.createElement('button')
    csvButton.innerText = 'Export CSV'
    csvButton.className = 'export-button'
    csvButton.addEventListener('click', () => {
        window.location.href = '/export/csv'
    })
    mainContainer.appendChild(csvButton)

    const docBookButton = document.createElement('button')
    docBookButton.innerText = 'Export DocBook'
    docBookButton.className = 'export-button'
    docBookButton.addEventListener('click', () => {
        window.location.href = '/export/docbook'
    })
    mainContainer.appendChild(docBookButton)

    fetch('/top10books')
        .then((response) => response.json())
        .then((data) => {
            const list = document.createElement('ul')
            data.forEach((book) => {
                const listItem = document.createElement('li')
                listItem.innerText = `${book.title} by ${book.author} - Rating: ${book.rating}`
                list.appendChild(listItem)
            })
            top10BooksContainer.appendChild(list)
        })
})
