document.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParts = window.location.pathname.split('/')
        const groupId = parseInt(urlParts.pop() || urlParts.pop(), 10)

        if (isNaN(groupId)) {
            throw new Error('Invalid group ID')
        }

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
                return data.isAuthenticated
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

        const moderatorLink = document.getElementById('moderator-link')
        moderatorLink.textContent = data.moderator.name
        moderatorLink.href = `/user-account/${data.team[0].moderatorId}`
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
        const isAuthenticated = await checkAuth()

        if (isAuthenticated) {
            joinButton.addEventListener('click', async (event) => {
                event.preventDefault()
                const success = await addUserToGroup(isAuthenticated, groupId)
                if (success) {
                    window.location.href = `/group-conv/${groupId}/1`
                } else {
                    console.error('Failed to add user to group')
                }
            })
        } else {
            joinButton.href = '/login'
        }
    } catch (error) {
        console.error('Error fetching group details:', error)
    }
})

async function addUserToGroup(email, groupId) {
    try {
        const response = await fetch('/api/add-user-to-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, groupId }),
        })

        if (!response.ok) {
            throw new Error('Failed to add user to group')
        }

        const data = await response.json()
        console.log('Server response:', data)

        return true
    } catch (error) {
        console.error('Error adding user to group:', error)
        return false
    }
}
