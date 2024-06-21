document.addEventListener('DOMContentLoaded', () => {
    const urlParts = window.location.pathname.split('/')
    const groupId = urlParts.pop() || urlParts.pop()

    async function checkAuth() {
        try {
            const response = await fetch('/api/check-auth', {
                method: 'GET',
                credentials: 'include',
            })
            const data = await response.json()
            return data.isAuthenticated
        } catch (error) {
            console.error('Error checking authentication:', error)
            return false
        }
    }

    fetch(`/api/group/${groupId}`)
        .then((response) => response.json())
        .then(async (data) => {
            document.getElementById('team-name').textContent =
                data.team[0].teamName
            document.getElementById('moderator-link').textContent =
                data.moderator
            document.getElementById(
                'team-description'
            ).textContent = `"${data.team[0].description}"`

            const blob = new Blob([new Uint8Array(data.team[0].photo.data)], {
                type: 'image/jpeg',
            })
            const imageUrl = URL.createObjectURL(blob)
            document.getElementById('team-photo').src = imageUrl

            const bookList = document.getElementById('book-list')
            data.books.forEach((book, index) => {
                const bookLink = document.createElement('a')
                bookLink.href = `/book/${book.id}`
                bookLink.textContent = book.title
                bookList.appendChild(bookLink)

                if (index < data.books.length - 1) {
                    const separator = document.createElement('span')
                    separator.classList.add('separator')
                    separator.textContent = ' - '
                    bookList.appendChild(separator)
                }
            })

            const joinButton = document.querySelector('.shelves a')
            const isLoggedIn = await checkAuth()

            if (isLoggedIn) {
                joinButton.href = `/group-conv/${groupId}/1`
            } else {
                joinButton.href = '/login'
            }
        })
        .catch((error) => {
            console.error('Error fetching group details:', error)
        })
})
