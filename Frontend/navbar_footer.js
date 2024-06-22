document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggle = document.getElementById('dropdown-toggle')
    const dropdownMenu = document.getElementById('dropdown-menu')

    dropdownMenu.style.display = 'none'

    dropdownToggle.addEventListener('click', function (event) {
        event.preventDefault()
        if (
            dropdownMenu.style.display === 'none' ||
            dropdownMenu.style.display === ''
        ) {
            dropdownMenu.style.display = 'block'
            dropdownMenu.style.position = 'absolute'
            dropdownMenu.style.top = dropdownToggle.offsetTop + 'px'
            dropdownMenu.style.right =
                dropdownToggle.offsetLeft + dropdownToggle.offsetWidth + 'px'
        } else {
            dropdownMenu.style.display = 'none'
        }
    })
})

function setFooterPosition() {
    const footer = document.querySelector('footer')
    const windowHeight = window.innerHeight
    const bodyHeight = document.body.clientHeight

    if (windowHeight > bodyHeight) {
        footer.style.position = 'fixed'
        footer.style.bottom = '0'
        footer.style.left = '0'
        footer.style.width = '100%'
    } else {
        footer.style.position = 'static'
    }
}

window.addEventListener('load', setFooterPosition)
window.addEventListener('resize', setFooterPosition)
