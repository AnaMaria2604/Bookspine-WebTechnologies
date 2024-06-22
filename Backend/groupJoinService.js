document.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParts = window.location.pathname.split('/')
        const groupId = urlParts.pop() || urlParts.pop()

        async function checkAuth() {
            try {
                const response = await fetch('/api/check-auth', {
                    method: 'GET',
                    credentials: 'include',
                })
                if (!response.ok) {
                    throw new Error('Failed to authenticate')
                }
                const data = await response.json()
                console.log(data.isAuthenticated)
                return data.isAuthenticated // Return email if authenticated, otherwise null
            } catch (error) {
                console.error('Error checking authentication:', error)
                return null
            }
        }

        const dataResponse = await fetch(`/api/group/${groupId}`)
        if (!dataResponse.ok) {
            throw new Error('Failed to fetch group details')
        }
        const data = await dataResponse.json()

        document.getElementById('team-name').textContent = data.team[0].teamName
        document.getElementById('moderator-link').textContent = data.moderator
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
        const userEmail = await checkAuth()

        if (userEmail) {
            joinButton.href = `/group-conv/${groupId}/1`
        } else {
            joinButton.href = '/login'
        }
    } catch (error) {
        console.error('Error fetching group details:', error)
    }
})
