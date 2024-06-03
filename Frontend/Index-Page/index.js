document.addEventListener("DOMContentLoaded", function () {
  const dropdownToggle = document.getElementById("dropdown-toggle");
  const dropdownMenu = document.getElementById("dropdown-menu");

  dropdownMenu.style.display = "none";

  dropdownToggle.addEventListener("click", function (event) {
    event.preventDefault();
    if (
      dropdownMenu.style.display === "none" ||
      dropdownMenu.style.display === ""
    ) {
      dropdownMenu.style.display = "block";
      dropdownMenu.style.position = "absolute";
      dropdownMenu.style.top = dropdownToggle.offsetTop + "px";
      dropdownMenu.style.right =
        dropdownToggle.offsetLeft + dropdownToggle.offsetWidth + "px";
    } else {
      dropdownMenu.style.display = "none";
    }
  });
});

function setFooterPosition() {
  const footer = document.querySelector("footer");
  const windowHeight = window.innerHeight;
  const bodyHeight = document.body.clientHeight;

  if (windowHeight > bodyHeight) {
    footer.style.position = "fixed";
    footer.style.bottom = "0";
    footer.style.left = "0";
    footer.style.width = "100%";
  } else {
    footer.style.position = "";
    footer.style.bottom = "";
    footer.style.left = "";
    footer.style.width = "";
  }
}

window.addEventListener("load", setFooterPosition);
window.addEventListener("resize", setFooterPosition);
// Frontend/Index-Page/index.js
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/recommended-books')
    .then(response => response.json())
    .then(data => {
      const recommendedContainer = document.getElementById('recommended-books');
      data.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.innerHTML = `<h3>${book.title}</h3><p>${book.author}</p>`;
        recommendedContainer.appendChild(bookElement);
      });
    });

  fetch('/api/popular-books')
    .then(response => response.json())
    .then(data => {
      const popularContainer = document.getElementById('popular-books');
      data.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.innerHTML = `<h3>${book.title}</h3><p>${book.author}</p>`;
        popularContainer.appendChild(bookElement);
      });
    });
});
