document.addEventListener('DOMContentLoaded', function () {
    const postbutton = document.getElementById('save-button')
    const titlu = document.getElementById('input1')
    const descr = document.getElementById('input2')

    postbutton.addEventListener('click', function () {
        const urlParts = window.location.pathname.split('/')
        const groupId = urlParts.pop() || urlParts.pop()
        const title = titlu.value
        const description = descr.value

        fetch(`/update-group-settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                id: groupId,
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
