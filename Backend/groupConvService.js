


document.addEventListener('DOMContentLoaded', () => {
    const urlParts = window.location.pathname.split('/')
    const bookId = urlParts.pop()
    const groupId = urlParts.pop()

    fetch(`/api/group-conv/${groupId}/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            // Populează numele grupului
            const groupNameElement = document.getElementById('group-name')
            groupNameElement.textContent = data.team[0].teamName

            // Populează lista de cărți
            console.log(data.books)
            const bookLinksElement = document.getElementById('book-links')
            data.books.forEach((book) => {
                const bookLink = document.createElement('a')
                bookLink.textContent = book.title
                bookLink.style.cursor = 'pointer'
                bookLink.addEventListener('click', () => {
                    console.log(groupId)
                    console.log(bookId)
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
            const conversationsElement =
                document.getElementById('conversations')
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
        })
        .catch((error) => {
            console.error('Error fetching data:', error)
        })
})
