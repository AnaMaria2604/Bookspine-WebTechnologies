document.addEventListener('DOMContentLoaded', function () {
    const urlParts = window.location.pathname.split('/')
    const userId = urlParts.pop() || urlParts.pop()

    fetch(`/user-account-details/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('detalii')
            data.forEach((user) => {
                const userBlob = new Blob([new Uint8Array(user.photo.data)], {
                    type: 'image/jpeg',
                })
                const userImageUrl = URL.createObjectURL(userBlob)
                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
                <div class="userphoto">
                    <img src="${userImageUrl}" alt=" ">
                </div>
                <div class="name">${user.firstName} ${user.lastName}</div>
                `
                details.appendChild(bookElement)
            })
        })
        .catch((error) => {
            console.error('Error fetching review page:', error)
        })

    fetch(`/user-account-details/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('aboutAndQuote')
            data.forEach((user) => {
                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
                <div>
                    <div class="container">
                        <div class="name_category">About</div>
                        <div class="answer_category">${user.description}</div>
                    </div>
                    <div class="container">
                        <div class="name_category">Favorite quote</div>
                        <div class="answer_category">“${user.favQuote}”</div>
                    </div>
                </div>
                `
                details.appendChild(bookElement)
            })
        })
        .catch((error) => {
            console.error('Error fetching review page:', error)
        })
})

