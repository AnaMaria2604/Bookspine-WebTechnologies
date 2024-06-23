document.addEventListener('DOMContentLoaded', function () {
    fetch(`/all-users-groups`)
        .then((response) => response.json())
        .then((data) => {
            const container1 = document.querySelector('.container1')
            const container2 = document.querySelector('.container2')

            // Afisăm utilizatorii în container1
            data.users.forEach((user) => {
                const userDiv = document.createElement('div')
                userDiv.classList.add('item')

                const emailDiv = document.createElement('div')
                emailDiv.textContent = user.email

                const deleteButton = document.createElement('div')
                deleteButton.classList.add('delete-button')
                deleteButton.textContent = 'Delete'
                deleteButton.addEventListener('click', function () {
                    fetch(`/delete/user/${user.id}`, { method: 'DELETE' })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok')
                            }
                            const contentType =
                                response.headers.get('content-type')
                            if (
                                !contentType ||
                                !contentType.includes('application/json')
                            ) {
                                throw new Error(
                                    'Response is not in JSON format'
                                )
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

                userDiv.appendChild(emailDiv)
                userDiv.appendChild(deleteButton)
                container1.appendChild(userDiv)
            })

            // Afisăm echipele în container2
            data.teams.forEach((team) => {
                const teamDiv = document.createElement('div')
                teamDiv.classList.add('item')

                const teamNameDiv = document.createElement('div')
                teamNameDiv.textContent = team.teamName

                const deleteButton = document.createElement('div')
                deleteButton.classList.add('delete-button')
                deleteButton.textContent = 'Delete'
                deleteButton.addEventListener('click', function () {
                    fetch(`/delete/group/${team.id}`, { method: 'DELETE' })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok')
                            }
                            return response.json()
                        })
                        .then((data) => {
                            teamDiv.remove()
                            console.log('Team deleted successfully:', data)
                        })
                        .catch((error) => {
                            console.error('Error deleting team:', error)
                        })
                })

                teamDiv.appendChild(teamNameDiv)
                teamDiv.appendChild(deleteButton)
                container2.appendChild(teamDiv)
            })
        })
        .catch((error) => {
            console.error('Error fetching data:', error)
        })
})
