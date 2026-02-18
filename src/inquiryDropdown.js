document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector("[data-inquiry-dropdown]")

    if (!dropdown) {
        return
    }

    const trigger = dropdown.querySelector("[data-inquiry-trigger]")
    const menu = dropdown.querySelector(".inquiry-dropdown-menu")
    const value = dropdown.querySelector(".inquiry-dropdown-value")
    const options = dropdown.querySelectorAll(".inquiry-dropdown-option")

    if (!trigger || !menu || !value || options.length === 0) {
        return
    }

    const closeMenu = () => {
        dropdown.classList.remove("is-open")
        menu.hidden = true
        trigger.setAttribute("aria-expanded", "false")
    }

    const openMenu = () => {
        dropdown.classList.add("is-open")
        menu.hidden = false
        trigger.setAttribute("aria-expanded", "true")
    }

    trigger.addEventListener("click", () => {
        if (dropdown.classList.contains("is-open")) {
            closeMenu()
            return
        }

        openMenu()
    })

    options.forEach((option) => {
        option.addEventListener("click", () => {
            const selectedValue = option.dataset.value

            if (!selectedValue) {
                return
            }

            value.textContent = selectedValue
            value.style.color = "#111111"
            closeMenu()
        })
    })

    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) {
            closeMenu()
        }
    })

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu()
        }
    })
})
