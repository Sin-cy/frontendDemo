const homepageLink = document.querySelector(".homepage-link")

if (homepageLink) {
    homepageLink.addEventListener("click", (event) => {
        event.preventDefault()
        window.scrollTo(0, 0)
    })
}
