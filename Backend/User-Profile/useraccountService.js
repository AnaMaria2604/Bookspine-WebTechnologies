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

// document.addEventListener('DOMContentLoaded', function () {
//     const urlParts = window.location.pathname.split('/')
//     const userId = urlParts.pop() || urlParts.pop()

//     fetch(`/user-account-details/${userId}`)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log('User Details:', data.userDetails)
//             console.log('Read Books:', data.readBooks)
//             console.log(data.bookCovers)

//             const details = document.getElementById('detalii')
//             data.userDetails.forEach((user) => {
//                 const userBlob = new Blob([new Uint8Array(user.photo.data)], {
//                     type: 'image/jpeg',
//                 })
//                 const userImageUrl = URL.createObjectURL(userBlob)
//                 const userElement = document.createElement('div')
//                 userElement.innerHTML = `
//                     <div class="userphoto">
//                         <img src="${userImageUrl}" alt="">
//                     </div>
//                     <div class="name">${user.firstName} ${user.lastName}</div>
//                 `
//                 details.appendChild(userElement)
//             })

//             const aboutAndQuote = document.getElementById('aboutAndQuote')
//             data.userDetails.forEach((info) => {
//                 const infoElement = document.createElement('div')
//                 infoElement.innerHTML = `
//                     <div class="container">
//                         <div class="name_category">About</div>
//                         <div class="answer_category">${info.description}</div>
//                     </div>
//                     <div class="container">
//                         <div class="name_category">Favorite quote</div>
//                         <div class="answer_category">“${info.favQuote}”</div>
//                     </div>
//                 `
//                 aboutAndQuote.appendChild(infoElement)
//             })

//             const readBooks = document.getElementById('read')
//             data.readBooks.forEach((book) => {
//                 const bookBlob = new Blob([new Uint8Array(book.cover)], {
//                     type: 'image/jpeg',
//                 })
//                 const bookImageUrl = URL.createObjectURL(bookBlob)

//                 console.log(bookImageUrl)
//                 const bookElement = document.createElement('div')
//                 bookElement.innerHTML = `
//                     <div class="book">
//                         <img src="${bookImageUrl}" alt=" ">
//                     </div>
//                 `
//                 readBooks.appendChild(bookElement)
//             })
//         })
//         .catch((error) => {
//             console.error('Error fetching user details:', error)
//         })
// })
//-------------------------------------------------------------

// document.addEventListener('DOMContentLoaded', function () {
//     const urlParts = window.location.pathname.split('/')
//     const userId = urlParts.pop() || urlParts.pop()

//     fetch(`/user-account-details/${userId}`)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log('User Details:', data.userDetails)
//             console.log('Read Books:', data.readBooks)
//             console.log('Book Covers:', data.bookCovers)

//             const details = document.getElementById('detalii')
//             data.userDetails.forEach((user) => {
//                 const userBlob = new Blob([new Uint8Array(user.photo.data)], {
//                     type: 'image/jpeg',
//                 })
//                 const userImageUrl = URL.createObjectURL(userBlob)
//                 const userElement = document.createElement('div')
//                 userElement.innerHTML = `
//                     <div class="userphoto">
//                         <img src="${userImageUrl}" alt="">
//                     </div>
//                     <div class="name">${user.firstName} ${user.lastName}</div>
//                 `
//                 details.appendChild(userElement)
//             })

//             const aboutAndQuote = document.getElementById('aboutAndQuote')
//             data.userDetails.forEach((info) => {
//                 const infoElement = document.createElement('div')
//                 infoElement.innerHTML = `
//                     <div class="container">
//                         <div class="name_category">About</div>
//                         <div class="answer_category">${info.description}</div>
//                     </div>
//                     <div class="container">
//                         <div class="name_category">Favorite quote</div>
//                         <div class="answer_category">“${info.favQuote}”</div>
//                     </div>
//                 `
//                 aboutAndQuote.appendChild(infoElement)
//             })

//             const readBooks = document.getElementById('read')
//             data.readBooks.forEach((book) => {
//                 const bookBlob = new Blob([new Uint8Array(book.cover)], {
//                     type: 'image/jpeg',
//                 })
//                 const bookImageUrl = URL.createObjectURL(bookBlob)
//                 const bookElement = document.createElement('div')
//                 bookElement.innerHTML = `
//                     <div class="book">
//                         <img src="${bookImageUrl}" alt="">
//                     </div>
//                 `
//                 readBooks.appendChild(bookElement)
//             })
//         })
//         .catch((error) => {
//             console.error('Error fetching user details:', error)
//         })
// })
