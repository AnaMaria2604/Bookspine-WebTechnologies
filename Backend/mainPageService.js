document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/mainpage')
        .then((response) => response.json())
        .then((data) => {
            // Populate Want to Read section
            const wantToReadBooks = document.getElementById('wantToReadBooks')
            data.wantToReadBooks.forEach((book) => {
                const bookElement = document.createElement('div')
                bookElement.classList.add('image')
                const img = document.createElement('img')
                const blob = new Blob([new Uint8Array(book.cover.data)], {
                    type: 'image/jpeg',
                })
                const imageUrl = URL.createObjectURL(blob)
                img.src = imageUrl
                img.alt = book.title
                bookElement.appendChild(img)
                wantToReadBooks.appendChild(bookElement)
            })

            // Populate Challenge section
            const monthlyChallengeTitle =
                document.getElementById('monthlyChallenge')
            const yearlyChallengeTitle =
                document.getElementById('yearlyChallenge')

            if (data.readingch != null) {
                monthlyChallengeTitle.textContent = `I want to read ${data.readingch[0].numberOfBooks} books this month.`
                yearlyChallengeTitle.textContent = `I want to read ${data.readingch[1].numberOfBooks} books this year.`
            } else {
                monthlyChallengeTitle.textContent = `I want to read 0 books this month.`
                yearlyChallengeTitle.textContent = `I want to read 0 books this year.`
            }
            // Populate Currently Reading section
            const currentlyReadingBooks = document.getElementById(
                'currentlyReadingBooks'
            )
            data.currentlyReadingBooks.forEach((book) => {
                const bookElement = document.createElement('div')
                bookElement.classList.add('image')
                const img = document.createElement('img')
                const blob = new Blob([new Uint8Array(book.cover.data)], {
                    type: 'image/jpeg',
                })
                const imageUrl = URL.createObjectURL(blob)
                img.src = imageUrl
                img.alt = book.title
                bookElement.appendChild(img)
                currentlyReadingBooks.appendChild(bookElement)
            })

            // Populate Updates section
            const updates = document.getElementById('updates')
            data.reviews.forEach((review) => {
                const item = document.createElement('div')
                item.classList.add('item')
                item.innerHTML = `
            <div class="user_content">
              <a href="/user-account/${review.user.id}">${review.user.lastName} ${review.user.firstName} </a>
            <div class="id">#id${review.user.id}</div>
              <div class="action">reviews</div>
              <div class="titlucarte">${review.bookTitle}</div>
            </div>
            <div class="descriere">"${review.reviewDescription}"</div>
            <div class="actions">
              <div class="review"><a href="/book/${review.bookId}">See the complete review</a></div>
            </div>
          `
                updates.appendChild(item)
            })
            data.readings.forEach((reading) => {
                const item = document.createElement('div')
                item.classList.add('item')
                item.innerHTML = `
            <div class="user_content">
              <a href="/user-account/${reading.user.id}">${reading.user.lastName} ${reading.user.firstName} </a>
              <div class="id">#id${reading.user.id}</div>
              <div class="action">finished the </div>
              <div class="titlucarte">${reading.bookTitle}</div>
            </div>
            <div class="descriere">"${reading.descr}"</div>
          `
                updates.appendChild(item)
            })
        })
        .catch((error) => console.error('Error fetching data:', error))
})
