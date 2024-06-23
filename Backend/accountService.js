document.addEventListener('DOMContentLoaded', function () {
    fetch(`/accountDetails`)
        .then((response) => response.json())
        .then((data) => {
            const userDetailsElement = document.getElementById('user-details')
            if (data.userDetails) {
                const userDetails = data.userDetails
                if (userDetails.photo && userDetails.photo.data) {
                    const userBlob = new Blob(
                        [new Uint8Array(userDetails.photo.data)],
                        { type: 'image/jpeg' }
                    )
                    const userImageUrl = URL.createObjectURL(userBlob)
                    const userElement = document.createElement('div')
                    userElement.innerHTML = `
                        <div>
                            <div class="user_content">
                                <div class="userphoto">
                                    <img class="cover-poza" src="${userImageUrl}" alt="">
                                </div>
                                <div class="name">${userDetails.lastName} ${userDetails.firstName}</div>
                            </div>
                            <div class="bookshelves">
                            <div class="title">Your shelfs:</div>
                                <div class="carte">
                                    <a href="/mybooks">Read</a>
                                </div>
                                <div class="carte">
                                    <a href="/mybooks">Want to Read</a>
                                </div>
                                <div class="carte">
                                    <a href="/mybooks">Reading</a>
                                </div>
                            </div>
                        </div>`
                    userDetailsElement.appendChild(userElement)
                } else {
                    console.error('User photo data is missing or incomplete.')
                    const userElement = document.createElement('div')
                    userElement.innerHTML = `
                        <div>
                            <div class="user_content">
                                <div class="userphoto">
                                    <img src="/path/to/default/user-image.jpg" alt="Default Image">
                                </div>
                                <div class="name">${userDetails.lastName} ${userDetails.firstName}</div>
                            </div>
                            <div class="bookshelves">
                                <div class="carte">
                                    <a href="/mybooks">Read</a>
                                </div>
                                <div class="carte">
                                    <a href="/mybooks">Want to Read</a>
                                </div>
                                <div class="carte">
                                    <a href="/mybooks">Reading</a>
                                </div>
                            </div>
                        </div>`
                    userDetailsElement.appendChild(userElement)
                }
            } else {
                console.error('User details are missing.')
            }

            const groupsElement = document.getElementById('groups-card')

            if (data.userGroups && data.userGroups.length > 0) {
                const userGroups = data.userGroups
                userGroups.forEach((group) => {
                    if (group.photo && group.photo.data) {
                        const groupBlob = new Blob(
                            [new Uint8Array(group.photo.data)],
                            { type: 'image/jpeg' }
                        )
                        const groupImageUrl = URL.createObjectURL(groupBlob)
                        const groupElement = document.createElement('div')
                        groupElement.innerHTML = `
                            <div>
                                <div class="componenta">
                                    <img src="${groupImageUrl}" alt="">
                                    <a href="/group/${group.id}">${group.teamName}</a>
                                </div>
                            </div>`
                        groupsElement.appendChild(groupElement)
                    } else {
                        console.error(
                            'Group photo data is missing or incomplete for group:',
                            group
                        )
                        const groupElement = document.createElement('div')
                        groupElement.innerHTML = `
                            <div>
                                <div class="componenta">
                                    <img src="/path/to/default/image.jpg" alt="Default Image">
                                    <a href="/group/${group.id}">${group.teamName}</a>
                                </div>
                            </div>`
                        groupsElement.appendChild(groupElement)
                    }
                })
            } else {
                console.error('User groups are missing.')
            }

            if (data.moderatorGroups && data.moderatorGroups.length > 0) {
                const moderatorGroups = data.moderatorGroups
                moderatorGroups.forEach((group) => {
                    if (group.photo && group.photo.data) {
                        const groupBlob = new Blob(
                            [new Uint8Array(group.photo.data)],
                            { type: 'image/jpeg' }
                        )
                        const groupImageUrl = URL.createObjectURL(groupBlob)
                        const groupElement = document.createElement('div')
                        groupElement.innerHTML = `
                            <div>
                                <div class="componenta">
                                    <img src="${groupImageUrl}" alt="">
                                    <a href="/group/${group.id}">${group.teamName}</a>
                                </div>
                            </div>`
                        groupsElement.appendChild(groupElement)
                    } else {
                        console.error(
                            'Group photo data is missing or incomplete for group:',
                            group
                        )
                        const groupElement = document.createElement('div')
                        groupElement.innerHTML = `
                            <div>
                                <div class="componenta">
                                    <img src="/path/to/default/image.jpg" alt="Default Image">
                                    <a href="/group/${group.id}">${group.teamName}</a>
                                </div>
                            </div>`
                        groupsElement.appendChild(groupElement)
                    }
                })
            } else {
                console.error('Moderator groups are missing.')
            }
        })
        .catch((error) => {
            console.error('Error fetching account details:', error)
        })

    fetch(`/nextGroupId`)
        .then((response) => response.json())
        .then((data) => {
            const details = document.getElementById('creare-grup')
            const idNou = data.nextGroupId

            const groupElement = document.createElement('div')
            groupElement.innerHTML = `
                <div class="button">
                    <a href="/create-group/${idNou}">Create a group</a>
                </div>`
            details.appendChild(groupElement)
        })
        .catch((error) => {
            console.error('Error fetching next group ID:', error)
        })

    document.getElementById('logOut').addEventListener('click', function () {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Success:', data)
                window.location.href = '/'
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    })

    const postbutton = document.getElementById('save-button')
    const about = document.getElementById('input1')
    const favquote = document.getElementById('quote')
    const first = document.getElementById('firstName')
    const last = document.getElementById('lastName')
    const newEmail = document.getElementById('email')
    const password = document.getElementById('pass')
    const confirmPassword = document.getElementById('pass2')

    postbutton.addEventListener('click', function () {
        const reviewContent1 = about.value
        const reviewContent2 = favquote.value
        const firstName = first.value
        const lastName = last.value
        const email = newEmail.value
        const pass1 = password.value
        const pass2 = confirmPassword.value

        fetch(`/saveDetails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: pass1,
                confirmPassword: pass2,
                about: reviewContent1,
                quote: reviewContent2,
                //photo: photo,
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
})
