// NOTE: button active state for Questions section

document.addEventListener('DOMContentLoaded', () => {
    const faqSection = document.querySelector('.question-section-container')

    if (!faqSection) {
        return
    }

    const tabButtons = Array.from(faqSection.querySelectorAll('.question-button-default[data-target]'))
    const firstQuestionTitle = faqSection.querySelector('.first-question-title')
    const secondQuestionTitle = faqSection.querySelector('.second-question-title')
    const thirdQuestionTitle = faqSection.querySelector('.third-question-title')

    const questionsByTab = {
        returns: {
            first: 'What is your return policy?',
            second: 'Can I exchange for a different size?',
            third: 'Are sale items refundable?'
        },
        shipping: {
            first: 'Do you offer international shipping?',
            second: 'How long does delivery take?',
            third: 'How can I track my order?'
        }
    }

    const updateQuestionTitle = (titleElement, nextTitle, shouldAnimate) => {
        if (!titleElement) {
            return
        }

        if (!shouldAnimate) {
            titleElement.textContent = nextTitle
            return
        }

        const animateTitleSwap = window.TitleSwapAnimation?.animateTitleSwap

        if (typeof animateTitleSwap === 'function') {
            animateTitleSwap(titleElement, nextTitle)
            return
        }

        titleElement.textContent = nextTitle
    }

    const setActiveTab = (targetName, { shouldAnimate = true } = {}) => {
        tabButtons.forEach((button) => {
            const isActive = button.dataset.target === targetName
            button.classList.toggle('is-active', isActive)
        })

        const tabQuestions = questionsByTab[targetName]

        if (!tabQuestions) {
            return
        }

        updateQuestionTitle(firstQuestionTitle, tabQuestions.first, shouldAnimate)
        updateQuestionTitle(secondQuestionTitle, tabQuestions.second, shouldAnimate)
        updateQuestionTitle(thirdQuestionTitle, tabQuestions.third, shouldAnimate)
    }

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            setActiveTab(button.dataset.target)
        })
    })

    setActiveTab('returns', { shouldAnimate: false })

    const dropdownToggles = Array.from(faqSection.querySelectorAll('.faq-question-toggle'))

    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const answer = toggle.parentElement?.querySelector('.faq-answer')

            if (!answer) {
                return
            }

            const nextState = !toggle.classList.contains('is-open')
            toggle.classList.toggle('is-open', nextState)
            toggle.setAttribute('aria-expanded', String(nextState))
            answer.classList.toggle('is-open', nextState)
        })
    })

})




