document.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParts = window.location.pathname.split('/')
        const bookId = urlParts.pop()
        const groupId = urlParts.pop()

        function changeLocation() {
            window.location.href = `/settings-group/${groupId}`
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
                console.log(data.isAuthenticated)
                return data.isAuthenticated // Return email if authenticated, otherwise null
            } catch (error) {
                console.error('Error checking authentication:', error)
                return null
            }
        }

        const response = await fetch(`/api/group-conv/${groupId}/${bookId}`)
        const data = await response.json()

        // Populează numele grupului
        const groupNameElement = document.getElementById('group-name')
        groupNameElement.textContent = data.team[0].teamName

        // Populează lista de cărți
        const bookLinksElement = document.getElementById('book-links')
        data.books.forEach((book) => {
            const bookLink = document.createElement('a')
            bookLink.textContent = book.title
            bookLink.style.cursor = 'pointer'
            bookLink.addEventListener('click', () => {
                window.location.href = `/group-conv/${groupId}/${book.id}`
            })
            bookLinksElement.appendChild(bookLink)
        })

        // Populează titlul cărții selectate
        const bookTitleElement = document.getElementById('book-title')
        const selectedBook = data.books.find((book) => book.id == bookId)
        if (selectedBook) {
            bookTitleElement.textContent = selectedBook.title
        }

        // Populează conversațiile
        const conversationsElement = document.getElementById('conversations')
        data.conversations.forEach((conv) => {
            const user = data.users.find((user) => user.id === conv.userId)
            let imageUrl = '../Images/default-user-photo.jpg' // Fallback image
            if (user && user.photo && user.photo.data) {
                const arrayBufferView = new Uint8Array(user.photo.data)
                const blob = new Blob([arrayBufferView], {
                    type: 'image/jpeg',
                })
                imageUrl = URL.createObjectURL(blob)
            }
            const convElement = document.createElement('div')
            convElement.classList.add('item')
            convElement.innerHTML = `
                <div class="user_content">
                    <div class="userphoto"><img src="${imageUrl}" alt="Imagine"></div>
                    <a href="../User-Profile-Page/userprofile.html?userId=${user.id}">${user.lastName}</a>
                </div>
                <div class="descriere">${conv.text}</div>
            `
            conversationsElement.appendChild(convElement)
        })

        const userEmail = await checkAuth() // Așteaptă autentificarea utilizatorului
        const moderatorId = data.moderator // Presupunând că serverul returnează ID-ul moderatorului grupului

        // Verifică dacă utilizatorul autentificat este moderatorul
        if (userEmail === moderatorId) {
            const settingsElement = document.querySelector('.settings')
            settingsElement.style.display = 'block'
            settingsElement.addEventListener('click', changeLocation) // Attach the click event listener
        }
    } catch (error) {
        console.error('Error fetching data:', error)
    }
})
document
    .getElementById('reviewForm')
    .addEventListener('submit', function (event) {
        event.preventDefault()

        const form = event.target
        const formData = new FormData(form)
        const review = formData.get('review')

        const url = window.location.pathname

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ review }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error('Error:', data.error)
                    alert('There was an error submitting your review.')
                } else {
                    console.log('Success:', data)
                    window.location.reload() // Refresh the page after a successful submission
                }
            })
            .catch((error) => {
                console.error('Error:', error)
                alert('There was an error submitting your review.')
            })
    })
