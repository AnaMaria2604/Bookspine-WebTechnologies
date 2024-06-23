document.addEventListener('DOMContentLoaded', function () {
    const postbutton = document.getElementById('save-button')
    const titlu = document.getElementById('input1')
    const descr = document.getElementById('input2')

    postbutton.addEventListener('click', function () {
        const title = titlu.value
        const description = descr.value

        fetch(`/save-created-group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
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
