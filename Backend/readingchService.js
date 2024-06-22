// document.addEventListener('DOMContentLoaded', function () {
//     fetch(`/reading-details`)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log('Datele primite de la server:', data)

//             const userDetails = data.userDetails
//             if (!userDetails || !userDetails.photo) {
//                 throw new Error(
//                     'Datele primite de la server nu sunt în formatul așteptat.'
//                 )
//             }

//             const blob = new Blob([new Uint8Array(userDetails.photo.data)], {
//                 type: 'image/jpeg',
//             })
//             const imageUrl = URL.createObjectURL(blob)
//             const details = document.getElementById('challenges')
//             details.innerHTML = ''

//             const challengesData = data.challenges
//             challengesData.forEach((challenge) => {
//                 const bookElement = document.createElement('div')
//                 bookElement.classList.add('ch') // Adăugăm clasa 'ch' pentru stilizare
//                 bookElement.innerHTML = `
//                     <img class="format__poza" alt="" src="${imageUrl}">
//                     <div class="format__text">
//                         You've read ${challenge.currentNumberOfBooks} out of the ${challenge.numberOfBooks} books you decided to read for ${challenge.type}.
//                         <div class="butoane">
//                             <button class="edit-btn">Edit</button>
//                             <button class="delete-btn">Delete</button>
//                         </div>
//                     </div>
//                 `
//                 details.appendChild(bookElement)

//                 const deleteBtn = bookElement.querySelector('.delete-btn')
//                 deleteBtn.addEventListener('click', function () {
//                     const chId = challenge.id
//                     console.log('Deleting challenge with ID:', chId)

//                     fetch('/delete-challenge', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({ id: chId }),
//                     })
//                         .then((response) => response.json())
//                         .then((data) => {
//                             if (data.success) {
//                                 console.log('Challenge deleted successfully')
//                                 bookElement.remove()
//                             } else {
//                                 console.error(
//                                     'Failed to delete challenge:',
//                                     data.message
//                                 )
//                             }
//                         })
//                         .catch((error) => {
//                             console.error('Failed to delete challenge:', error)
//                         })
//                 })

//                 document.querySelectorAll('.edit-btn').forEach((button) => {
//                     button.addEventListener('click', function () {
//                         const challengeId = this.getAttribute('data-id')
//                         window.location.href = `/edit-challenge/${challengeId}`
//                     })
//                 })
//             })
//         })
//         .catch((error) => {
//             console.error('Eroare la aducerea datelor:', error)
//         })
// })

document.addEventListener('DOMContentLoaded', function () {
    fetch(`/reading-details`)
        .then((response) => response.json())
        .then((data) => {
            console.log('Datele primite de la server:', data)

            const userDetails = data.userDetails
            if (!userDetails || !userDetails.photo) {
                throw new Error(
                    'Datele primite de la server nu sunt în formatul așteptat.'
                )
            }

            const blob = new Blob([new Uint8Array(userDetails.photo.data)], {
                type: 'image/jpeg',
            })
            const imageUrl = URL.createObjectURL(blob)
            const details = document.getElementById('challenges')
            details.innerHTML = ''

            const challengesData = data.challenges
            challengesData.forEach((challenge) => {
                const bookElement = document.createElement('div')
                bookElement.classList.add('ch') // Adăugăm clasa 'ch' pentru stilizare
                bookElement.innerHTML = `
                    <img class="format__poza" alt="" src="${imageUrl}">
                    <div class="format__text">
                        You've read ${challenge.currentNumberOfBooks} out of the ${challenge.numberOfBooks}
                        books you decided to read for ${challenge.type}.
                        <div class="butoane">
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                        <form class="edit-form" style="display: none;">
                            <label>Edit number of books:</label>
                            <input type="number" name="numberOfBooks" value="${challenge.numberOfBooks}" min="1" required>
                            <button type="submit" class="save-btn">->Save</button>
                        </form>
                    </div>
                `
                details.appendChild(bookElement)

                const deleteBtn = bookElement.querySelector('.delete-btn')
                deleteBtn.addEventListener('click', function () {
                    const chId = challenge.id
                    console.log('Deleting challenge with ID:', chId)

                    fetch('/delete-challenge', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: chId }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                console.log('Challenge deleted successfully')
                                bookElement.remove()
                            } else {
                                console.error(
                                    'Failed to delete challenge:',
                                    data.message
                                )
                            }
                        })
                        .catch((error) => {
                            console.error('Failed to delete challenge:', error)
                        })
                })

                const editBtn = bookElement.querySelector('.edit-btn')
                const editForm = bookElement.querySelector('.edit-form')
                const numBooksSpan = bookElement.querySelector('.num-books')

                editBtn.addEventListener('click', function () {
                    editForm.style.display = 'block'
                    numBooksSpan.style.display = 'none'
                })

                const saveBtn = bookElement.querySelector('.save-btn')

                editForm.addEventListener('submit', function (event) {
                    event.preventDefault()
                    const newNumberOfBooks = parseInt(
                        editForm.numberOfBooks.value
                    )
                    if (isNaN(newNumberOfBooks)) {
                        alert('Please enter a valid number')
                        return
                    }

                    const updatedChallenge = {
                        id: challenge.id,
                        numberOfBooks: newNumberOfBooks,
                    }

                    fetch('/update-challenge', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedChallenge),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                console.log('Challenge updated successfully')
                                window.location.reload()
                            } else {
                                console.error(
                                    'Failed to update challenge:',
                                    data.message
                                )
                            }
                        })
                        .catch((error) => {
                            console.error('Failed to update challenge:', error)
                        })
                })
            })
        })
        .catch((error) => {
            console.error('Eroare la aducerea datelor:', error)
        })
})
