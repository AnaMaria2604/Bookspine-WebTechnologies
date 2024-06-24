document.addEventListener('DOMContentLoaded', function () {
    fetch(`/reading-details`)
        .then((response) => response.json())
        .then((data) => {

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
                            <button class="edit-btn">Edit reading challenge!</button>
                        </div>
                        <form class="edit-form" style="display: none;">
                            <label>Edit number of books:</label>
                            <input type="number" name="numberOfBooks" value="${challenge.numberOfBooks}" min="1" required>
                            <button type="submit" class="save-btn">->Save</button>
                        </form>
                    </div>
                `
                details.appendChild(bookElement)

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
