// Shrink SVG Logo Header
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header-container')
    const shrinkThreshold = 20

    if (!header) {
        return
    }

    const tinyMobileQuery = window.matchMedia('(width < 391px)')

    const syncHeaderShrinkState = () => {
        if (tinyMobileQuery.matches) {
            header.classList.remove('shrunk')
            return
        }

        if (window.scrollY > shrinkThreshold) {
            header.classList.add('shrunk')
        }
    }

    // Initial check (e.g., refresh mid-page)
    syncHeaderShrinkState()

    // Scroll listener with passive for better perf
    window.addEventListener('scroll', () => {
        if (tinyMobileQuery.matches) {
            header.classList.remove('shrunk')
            return
        }

        if (window.scrollY > shrinkThreshold && !header.classList.contains('shrunk')) {
            header.classList.add('shrunk')
        }
    }, { passive: true })

    tinyMobileQuery.addEventListener('change', syncHeaderShrinkState)
})

// navbar active hover editorial check
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.dropdown')

    dropdown.addEventListener('mouseenter', () => {
        dropdown.classList.add('active')
    })

    dropdown.addEventListener('mouseleave', () => {
        dropdown.classList.remove('active')
    })
})

// touch language dropdown toggle (tap to open/close)
document.addEventListener('DOMContentLoaded', () => {
    const langList = document.querySelector('.lang-list')
    const langMenu = document.querySelector('.lang-dropdown-menu')
    const mobileLangQuery = window.matchMedia('(width <= 767px)')

    if (!langList || !langMenu) {
        return
    }

    const closeLangMenu = () => {
        langList.classList.remove('is-open')
    }

    // toggle only for mobile
    langList.addEventListener('click', (event) => {
        if (!mobileLangQuery.matches) {
            return
        }

        event.stopPropagation()
        langList.classList.toggle('is-open')
    })

    // drop down never close on taping drop down itself
    langMenu.addEventListener('click', (event) => {
        if (!mobileLangQuery.matches) {
            return
        }

        event.stopPropagation()
    })

    // close menu when tapping outside
    document.addEventListener('click', (event) => {
        if (!mobileLangQuery.matches) {
            return
        }

        if (!langList.contains(event.target)) {
            closeLangMenu()
        }
    })

    // close menu when switching input mode
    mobileLangQuery.addEventListener('change', () => {
        closeLangMenu()
    })
})

// touch language dropdown toggle for mid-screen tablets
document.addEventListener('DOMContentLoaded', () => {
    const langList = document.querySelector('.lang-list')
    const langMenu = document.querySelector('.lang-dropdown-menu')
    const tapLangQuery = window.matchMedia('(hover: none), (pointer: coarse)')
    const midScreenQuery = window.matchMedia('(width >= 768px) and (width <= 1024px)')

    if (!langList || !langMenu) {
        return
    }

    const shouldEnableTabletTap = () => {
        return tapLangQuery.matches && midScreenQuery.matches
    }

    const closeLangMenu = () => {
        langList.classList.remove('is-open')
    }

    langList.addEventListener('click', (event) => {
        if (!shouldEnableTabletTap()) {
            return
        }

        event.stopPropagation()
        langList.classList.toggle('is-open')
    })

    langMenu.addEventListener('click', (event) => {
        if (!shouldEnableTabletTap()) {
            return
        }

        event.stopPropagation()
    })

    document.addEventListener('click', (event) => {
        if (!shouldEnableTabletTap()) {
            return
        }

        if (!langList.contains(event.target)) {
            closeLangMenu()
        }
    })

    tapLangQuery.addEventListener('change', closeLangMenu)
    midScreenQuery.addEventListener('change', closeLangMenu)
})

// mobile nav tabs toggle
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.nav-container')
    const mobileToggle = document.querySelector('.mobile-menu-toggle')
    const navTabs = document.querySelector('#primary-mobile-nav')
    const editorialDropdown = navTabs?.querySelector('.mobile-editorial-dropdown')
    const mobileQuery = window.matchMedia('(width <= 767px)')
    const langList = document.querySelector('.lang-list')
    let isPageLocked = false
    let pausedVideos = []

    if (!navContainer || !mobileToggle || !navTabs) {
        return
    }

    const lockPageScroll = () => {
        if (isPageLocked) {
            return
        }

        document.documentElement.style.overflow = 'hidden'
        document.documentElement.style.touchAction = 'none'
        document.body.style.overflow = 'hidden'
        document.body.style.touchAction = 'none'
        isPageLocked = true
    }

    const unlockPageScroll = () => {
        if (!isPageLocked) {
            return
        }

        document.documentElement.style.overflow = ''
        document.documentElement.style.touchAction = ''
        document.body.style.overflow = ''
        document.body.style.touchAction = ''
        isPageLocked = false
    }

    const pauseBackgroundVideos = () => {
        pausedVideos = []

        document.querySelectorAll('video').forEach((video) => {
            if (video.paused || video.ended || video.readyState === 0) {
                return
            }

            pausedVideos.push(video)
            video.pause()
        })
    }

    const resumeBackgroundVideos = () => {
        pausedVideos.forEach((video) => {
            const playPromise = video.play()

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {})
            }
        })

        pausedVideos = []
    }

    const openMobileMenu = () => {
        navContainer.classList.add('is-menu-open')
        mobileToggle.setAttribute('aria-expanded', 'true')
        lockPageScroll()
        pauseBackgroundVideos()
    }

    const closeMobileMenu = () => {
        navContainer.classList.remove('is-menu-open')
        editorialDropdown?.classList.remove('is-open-mobile')
        editorialDropdown?.classList.remove('is-list-visible')
        mobileToggle.setAttribute('aria-expanded', 'false')
        unlockPageScroll()
        resumeBackgroundVideos()
    }

    mobileToggle.addEventListener('click', (event) => {
        if (!mobileQuery.matches) {
            return
        }

        event.stopPropagation()

        if (langList?.classList.contains('is-open')) {
            langList?.classList.remove('is-open')
            return
        }

        // Always reset mobile editorial state on hamburger taps
        editorialDropdown?.classList.remove('is-open-mobile')
        editorialDropdown?.classList.remove('is-list-visible')

        if (navContainer.classList.contains('is-menu-open')) {
            closeMobileMenu()
            return
        }

        openMobileMenu()
    })

    navTabs.addEventListener('click', (event) => {
        if (!mobileQuery.matches) {
            return
        }

        // Mobile editorial: tap once to open inline list
        if (event.target.closest('.mobile-editorial-trigger')) {
            event.preventDefault()

            if (!editorialDropdown?.classList.contains('is-open-mobile')) {
                editorialDropdown?.classList.add('is-open-mobile')

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        editorialDropdown?.classList.add('is-list-visible')
                    })
                })
            }

            return
        }

        // Keep editorial items visible/clickable without closing panel
        if (event.target.closest('.mobile-editorial-menu a')) {
            return
        }

        if (event.target.closest('a')) {
            closeMobileMenu()
        }
    })

    document.addEventListener('click', (event) => {
        if (!mobileQuery.matches) {
            return
        }

        if (!navContainer.contains(event.target)) {
            closeMobileMenu()
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMobileMenu()
        }
    })

    mobileQuery.addEventListener('change', () => {
        closeMobileMenu()
    })
})

// MAYBE: spacebar prevents page scroll down but runs animation
// document.addEventListener('DOMContentLoaded', () => {
//   const headerEl = document.querySelector('.header-container');

//   document.addEventListener('keydown', (event) => {
//     if (event.key === ' ') { // Check for spacebar
//       event.preventDefault(); // Stop default scroll
//       headerEl.classList.toggle('shrunk'); // Toggle shrink class
//     }
//   });
// });
