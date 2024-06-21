console.log('update book service')

document.addEventListener('DOMContentLoaded', function () {
    const urlParts = window.location.pathname.split('/')
    const bookId = urlParts.pop() || urlParts.pop()

    const textinput1 = document.getElementById('textarea-text1')
    const textinput2 = document.getElementById('textarea-text2')
    const pageNumber = document.getElementById('quantity')
    const postbutton = document.getElementById('post-button')

    postbutton.addEventListener('click', function () {
        const reviewContent1 = textinput1.value
        const reviewContent2 = textinput2.value
        const numberContent = pageNumber.value

        console.log(
            'input: ' +
                bookId +
                ' ' +
                reviewContent1 +
                ' ' +
                reviewContent2 +
                ' ' +
                numberContent
        )

        fetch(`/post-update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookId: bookId,
                numberContent: numberContent,
                input1: reviewContent1,
                input2: reviewContent2,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    })

    fetch(`/update/${bookId}`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('page-header')
            data.forEach((book) => {
                const blob = new Blob([new Uint8Array(book.cover.data)], {
                    type: 'image/jpeg',
                })
                const imageUrl = URL.createObjectURL(blob)
                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
                <div class="book-header">
                    <img class="poza" alt="" src="${imageUrl}">
                    <div class="text">
                        <div class="titlu">${book.title}</div>
                        <div class="autor">by ${book.author}</div>
                    </div>
                </div>`
                details.appendChild(bookElement)
            })
        })
        .catch((error) => {
            console.error('Error fetching review page:', error)
        })
})
