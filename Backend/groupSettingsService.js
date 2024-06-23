document.addEventListener('DOMContentLoaded', function () {
    const postbutton = document.getElementById('save-button')
    const deletebutton = document.getElementById('delete-button')
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

    deletebutton.addEventListener('click', function () {
        const urlParts = window.location.pathname.split('/')
        const groupId = urlParts.pop() || urlParts.pop()

        fetch(`/delete/group/${groupId}`, { method: 'DELETE' })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const contentType = response.headers.get('content-type')
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Response is not in JSON format')
                }
                return response.json()
            })
            .then((data) => {
                userDiv.remove()
                console.log('User deleted successfully:', data)
            })
            .catch((error) => {
                console.error('Error deleting user:', error)
            })
    })
})
