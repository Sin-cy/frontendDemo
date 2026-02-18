// NOTE: button active state + animation for Questions section

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

    const titleSwapSequence = new WeakMap()
    const titleSwapTimers = new WeakMap()
    const activeCrossfadeCleanup = new WeakMap()
    const debugPrefix = '[faq-title-debug]'

    // NOTE: set out, in and delay here 
    const crossfadeConfig = {
        outgoingDuration: 820,
        incomingDuration: 840,
        incomingDelay: 0.7
    }

    const fallbackConfig = {
        fadeOutDuration: 520,
        swapDelay: 90,
        fadeInDuration: 560
    }

    let activeTarget = 'returns'

    const clearTitleTimers = (titleElement) => {
        const timers = titleSwapTimers.get(titleElement)

        if (!timers) {
            return
        }

        timers.forEach((timerId) => {
            window.clearTimeout(timerId)
        })

        titleSwapTimers.delete(titleElement)
    }

    const queueTitleTimer = (titleElement, callback, delay) => {
        const timerId = window.setTimeout(() => {
            const timers = titleSwapTimers.get(titleElement)

            if (timers) {
                timers.delete(timerId)
            }

            callback()
        }, delay)

        const timers = titleSwapTimers.get(titleElement) || new Set()
        timers.add(timerId)
        titleSwapTimers.set(titleElement, timers)
    }

    const clearCrossfadeState = (titleElement) => {
        const cleanup = activeCrossfadeCleanup.get(titleElement)

        if (typeof cleanup === 'function') {
            cleanup()
            activeCrossfadeCleanup.delete(titleElement)
        }
    }

    const getCurrentRenderedTitleText = (titleElement) => {
        const incomingLayerText = titleElement
            .querySelector('.faq-title-crossfade-layer--in')
            ?.textContent
            ?.trim()

        if (incomingLayerText) {
            return incomingLayerText
        }

        const outgoingLayerText = titleElement
            .querySelector('.faq-title-crossfade-layer--out')
            ?.textContent
            ?.trim()

        if (outgoingLayerText) {
            return outgoingLayerText
        }

        return titleElement.textContent.trim()
    }

    const restoreInlineStyles = (titleElement, inlineStyles) => {
        titleElement.style.position = inlineStyles.position
        titleElement.style.display = inlineStyles.display
        titleElement.style.width = inlineStyles.width
        titleElement.style.minHeight = inlineStyles.minHeight
        titleElement.style.overflow = inlineStyles.overflow
        titleElement.style.transition = inlineStyles.transition
        titleElement.style.opacity = inlineStyles.opacity
    }

    const runFallbackFadeSwap = (titleElement, nextTitle, sequenceId) => {
        const { fadeOutDuration, swapDelay, fadeInDuration } = fallbackConfig

        return new Promise((resolve) => {
            let isResolved = false

            const resolveOnce = () => {
                if (isResolved) {
                    return
                }

                isResolved = true
                resolve()
            }

            console.log(debugPrefix, 'fallback fade-out start', {
                sequenceId,
                currentText: titleElement.textContent,
                nextText: nextTitle,
                elementClass: titleElement.className
            })

            titleElement.style.transition = `opacity ${fadeOutDuration}ms ease`
            titleElement.style.opacity = '0'

            queueTitleTimer(titleElement, () => {
                if (titleSwapSequence.get(titleElement) !== sequenceId) {
                    resolveOnce()
                    return
                }

                titleElement.textContent = nextTitle

                console.log(debugPrefix, 'fallback text swapped', {
                    sequenceId,
                    text: nextTitle,
                    elementClass: titleElement.className,
                    swapDelay
                })

                titleElement.style.transition = `opacity ${fadeInDuration}ms ease`
                titleElement.style.opacity = '1'

                queueTitleTimer(titleElement, () => {
                    if (titleSwapSequence.get(titleElement) !== sequenceId) {
                        resolveOnce()
                        return
                    }

                    titleElement.style.transition = ''
                    titleElement.style.opacity = ''

                    console.log(debugPrefix, 'fallback fade-in complete', {
                        sequenceId,
                        elementClass: titleElement.className
                    })

                    resolveOnce()
                }, fadeInDuration)
            }, swapDelay)
        })
    }

    const runCssCrossfadeSwap = (titleElement, currentText, nextTitle, sequenceId) => {
        return new Promise((resolve) => {
            let isResolved = false

            const resolveOnce = () => {
                if (isResolved) {
                    return
                }

                isResolved = true
                resolve()
            }

            if (!currentText) {
                titleElement.textContent = nextTitle
                resolveOnce()
                return
            }

            const computedStyle = window.getComputedStyle(titleElement)
            const inlineStyles = {
                position: titleElement.style.position,
                display: titleElement.style.display,
                width: titleElement.style.width,
                minHeight: titleElement.style.minHeight,
                overflow: titleElement.style.overflow,
                transition: titleElement.style.transition,
                opacity: titleElement.style.opacity
            }

            if (computedStyle.position === 'static') {
                titleElement.style.position = 'relative'
            }

            if (computedStyle.display === 'inline') {
                titleElement.style.display = 'inline-block'
            }

            const hostRect = titleElement.getBoundingClientRect()
            const currentWidth = Math.max(hostRect.width, 1)
            const currentHeight = Math.max(hostRect.height, 1)

            titleElement.style.width = `${currentWidth}px`
            titleElement.style.minHeight = `${currentHeight}px`
            titleElement.style.overflow = 'hidden'
            titleElement.classList.add('faq-title-crossfade-host')
            titleElement.textContent = ''

            const outgoingLayer = document.createElement('span')
            outgoingLayer.className = 'faq-title-crossfade-layer faq-title-crossfade-layer--out'
            outgoingLayer.setAttribute('aria-hidden', 'true')
            outgoingLayer.textContent = currentText

            const incomingLayer = document.createElement('span')
            incomingLayer.className = 'faq-title-crossfade-layer faq-title-crossfade-layer--in'
            incomingLayer.setAttribute('aria-hidden', 'true')
            incomingLayer.textContent = nextTitle

            outgoingLayer.style.setProperty('--faq-title-out-duration', `${crossfadeConfig.outgoingDuration}ms`)
            incomingLayer.style.setProperty('--faq-title-in-duration', `${crossfadeConfig.incomingDuration}ms`)
            incomingLayer.style.setProperty('--faq-title-in-delay', `${crossfadeConfig.incomingDelay}ms`)

            titleElement.append(outgoingLayer, incomingLayer)

            const nextHeight = Math.max(incomingLayer.getBoundingClientRect().height, 1)
            titleElement.style.minHeight = `${Math.max(currentHeight, nextHeight)}px`

            console.log(debugPrefix, 'css crossfade start', {
                sequenceId,
                outgoingDuration: crossfadeConfig.outgoingDuration,
                incomingDuration: crossfadeConfig.incomingDuration,
                incomingDelay: crossfadeConfig.incomingDelay,
                currentText,
                nextText: nextTitle,
                elementClass: titleElement.className
            })

            const finalizeSwap = () => {
                if (titleSwapSequence.get(titleElement) !== sequenceId) {
                    resolveOnce()
                    return
                }

                titleElement.textContent = nextTitle
                titleElement.classList.remove('faq-title-crossfade-host')
                restoreInlineStyles(titleElement, inlineStyles)
                activeCrossfadeCleanup.delete(titleElement)

                console.log(debugPrefix, 'css crossfade complete', {
                    sequenceId,
                    elementClass: titleElement.className
                })

                resolveOnce()
            }

            activeCrossfadeCleanup.set(titleElement, () => {
                const snapshotText = incomingLayer.textContent?.trim()
                    || outgoingLayer.textContent?.trim()
                    || titleElement.textContent.trim()

                titleElement.textContent = snapshotText
                titleElement.classList.remove('faq-title-crossfade-host')
                restoreInlineStyles(titleElement, inlineStyles)
                resolveOnce()
            })

            const totalDuration = Math.max(
                crossfadeConfig.outgoingDuration,
                crossfadeConfig.incomingDuration + crossfadeConfig.incomingDelay
            ) + 60

            queueTitleTimer(titleElement, finalizeSwap, totalDuration)
        })
    }

    const updateQuestionTitle = (titleElement, nextTitle, shouldAnimate) => {
        if (!titleElement) {
            return Promise.resolve()
        }

        if (!shouldAnimate) {
            titleElement.textContent = nextTitle
            return Promise.resolve()
        }

        const sanitizedNextTitle = String(nextTitle)
        const currentRenderedTitle = getCurrentRenderedTitleText(titleElement)

        if (!sanitizedNextTitle) {
            titleElement.textContent = ''
            return Promise.resolve()
        }

        if (currentRenderedTitle === sanitizedNextTitle) {
            return Promise.resolve()
        }

        const sequenceId = (titleSwapSequence.get(titleElement) || 0) + 1
        titleSwapSequence.set(titleElement, sequenceId)

        clearTitleTimers(titleElement)
        clearCrossfadeState(titleElement)

        try {
            return runCssCrossfadeSwap(titleElement, currentRenderedTitle, sanitizedNextTitle, sequenceId)
        } catch {
            return runFallbackFadeSwap(titleElement, sanitizedNextTitle, sequenceId)
        }
    }

    const setActiveButton = (targetName) => {
        tabButtons.forEach((button) => {
            const isActive = button.dataset.target === targetName
            button.classList.toggle('is-active', isActive)
        })
    }

    const setActiveTab = (targetName, { shouldAnimate = true } = {}) => {
        setActiveButton(targetName)

        const tabQuestions = questionsByTab[targetName]

        if (!tabQuestions) {
            return
        }

        activeTarget = targetName

        updateQuestionTitle(firstQuestionTitle, tabQuestions.first, shouldAnimate)
        updateQuestionTitle(secondQuestionTitle, tabQuestions.second, shouldAnimate)
        updateQuestionTitle(thirdQuestionTitle, tabQuestions.third, shouldAnimate)
    }

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log(debugPrefix, 'tab clicked', {
                buttonId: button.id,
                target: button.dataset.target
            })

            if (button.dataset.target === activeTarget) {
                return
            }

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



