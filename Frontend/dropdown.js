const wordsDictionary = [
    'book1',
    'book2',
    'book3',
    'book4',
    'book5',
    'book6',
    'book7',
    'book8',
    'book9',
    'book10',
]
const wordInput = document.getElementById('wordInput')
const dropdown = document.getElementById('dropdown')
const selectedWordsDiv = document.getElementById('selected-words')

function findMatchingWords(dictionary, inputWord) {
    return dictionary.filter((word) => word.startsWith(inputWord))
}

wordInput.addEventListener('input', () => {
    const inputWord = wordInput.value
    const matchingWords = findMatchingWords(wordsDictionary, inputWord)
    dropdown.innerHTML = ''
    if (matchingWords.length > 0 && inputWord !== '') {
        matchingWords.forEach((word) => {
            const div = document.createElement('div')
            div.textContent = word
            div.addEventListener('click', () => {
                const selectedWord = document.createElement('div')
                selectedWord.textContent = word
                selectedWordsDiv.appendChild(selectedWord)
                dropdown.innerHTML = ''
                dropdown.style.display = 'none'
                wordInput.value = ''
            })
            dropdown.appendChild(div)
        })
        dropdown.style.display = 'block'
    } else {
        dropdown.style.display = 'none'
    }
})

document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target) && event.target !== wordInput) {
        dropdown.style.display = 'none'
    }
})
