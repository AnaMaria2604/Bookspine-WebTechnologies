function daysUntilEndOfMonth() {
    const today = new Date()
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const days = Math.ceil((endOfMonth - today) / (1000 * 60 * 60 * 24))
    return days
}

function daysUntilEndOfYear() {
    const today = new Date()
    const endOfYear = new Date(today.getFullYear(), 11, 31)
    const days = Math.ceil((endOfYear - today) / (1000 * 60 * 60 * 24))
    return days
}

function updateDaysForReadingCh() {
    const daysUntilNextMonth = daysUntilEndOfMonth()
    const daysUntilNextYear = daysUntilEndOfYear()

    document.querySelector('#days-month').textContent = daysUntilNextMonth
    document.querySelector('#days-year').textContent = daysUntilNextYear
}

document.addEventListener('DOMContentLoaded', updateDaysForReadingCh)
