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

    // toggle only for mobile widths
    langList.addEventListener('click', (event) => {
        if (!mobileLangQuery.matches) {
            return
        }

        event.stopPropagation()
        langList.classList.toggle('is-open')
    })

    // close menu after picking a dropdown item on touch devices
    langMenu.addEventListener('click', (event) => {
        if (!mobileLangQuery.matches) {
            return
        }

        event.stopPropagation()

        if (event.target.closest('.lang-dropdown-item')) {
            closeLangMenu()
        }
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

    // close menu on Esc or when switching input mode
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileLangQuery.matches) {
            closeLangMenu()
        }
    })

    mobileLangQuery.addEventListener('change', () => {
        closeLangMenu()
    })
})

// mobile nav tabs toggle
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.nav-container')
    const mobileToggle = document.querySelector('.mobile-menu-toggle')
    const navTabs = document.querySelector('#primary-mobile-nav')
    const editorialDropdown = navTabs?.querySelector('.mobile-editorial-dropdown')
    const mobileQuery = window.matchMedia('(width <= 767px)')
    const langList = document.querySelector('.lang-list')
    let lockedScrollY = 0
    let isPageLocked = false
    let pausedVideos = []

    if (!navContainer || !mobileToggle || !navTabs) {
        return
    }

    const lockPageScroll = () => {
        if (isPageLocked) {
            return
        }

        lockedScrollY = window.scrollY || window.pageYOffset || 0
        document.body.style.position = 'fixed'
        document.body.style.top = `-${lockedScrollY}px`
        document.body.style.left = '0'
        document.body.style.right = '0'
        document.body.style.width = '100%'
        document.body.style.overflow = 'hidden'
        isPageLocked = true
    }

    const unlockPageScroll = () => {
        if (!isPageLocked) {
            return
        }

        const topValue = document.body.style.top
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        isPageLocked = false

        const restoredY = topValue ? Math.abs(parseInt(topValue, 10)) : lockedScrollY
        window.scrollTo(0, restoredY)
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
