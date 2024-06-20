document.addEventListener('DOMContentLoaded', () => {
    const urlParts = window.location.pathname.split('/')
    const groupId = urlParts.pop() || urlParts.pop()
    fetch(`/api/group/${groupId}`)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('team-name').textContent =
                data.team[0].teamName
            document.getElementById('moderator-link').textContent =
                'Popescu Valentin'
            document.getElementById('team-description').textContent =
                data.team[0].description

            const blob = new Blob([new Uint8Array(data.team[0].photo.data)], {
                type: 'image/jpeg',
            })
            const imageUrl = URL.createObjectURL(blob)
            document.getElementById('team-photo').src = imageUrl

            const bookList = document.getElementById('book-list')
            data.books.forEach((book) => {
                const bookLink = document.createElement('a')
                bookLink.href = `/book/${book.id}`
                bookLink.textContent = book.title
                bookList.appendChild(bookLink)

                const separator = document.createElement('div')
                separator.classList.add('text1')
                separator.textContent = 'and'
                bookList.appendChild(separator)
            })

            // Remove last separator
            if (bookList.lastChild) {
                bookList.removeChild(bookList.lastChild)
            }
        })
        .catch((error) => {
            console.error('Error fetching group details:', error)
        })
})
