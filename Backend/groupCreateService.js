document.addEventListener('DOMContentLoaded', function () {
    const postbutton = document.getElementById('save-button')
    const titlu = document.getElementById('input1')
    const descr = document.getElementById('input2')
    const alegere1 = document.getElementById('alg1')
    const alegere2 = document.getElementById('alg2')
    const alegere3 = document.getElementById('alg3')
    const alegere4 = document.getElementById('alg4')

    const urlParts = window.location.pathname.split('/')
    const groupId = urlParts.pop() || urlParts.pop()

    fetch(`/getbooks`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('carti')
            data.forEach((book) => {
                const bookElement = document.createElement('div')
                bookElement.innerHTML = `
                <div>
                    <div class="details">
                        ${book.title} - id: ${book.id}
                    </div>
                </div>`
                details.appendChild(bookElement)
            })
        })
        .catch((error) => {
            console.error('Error fetching books:', error)
        })

    postbutton.addEventListener('click', function () {
        const title = titlu.value
        const description = descr.value
        const alg1 = alegere1.value
        const alg2 = alegere2.value
        const alg3 = alegere3.value
        const alg4 = alegere4.value

        const alegeriFacute = {
            alg1: alg1,
            alg2: alg2,
            alg3: alg3,
            alg4: alg4,
        }
        console.log(alegeriFacute)

        fetch(`/save-created-group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                alegeri: alegeriFacute,
                groupId: groupId,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                window.location.href = '/mainpage'
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    })
})
