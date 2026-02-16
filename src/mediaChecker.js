// check type of media 
document.addEventListener("DOMContentLoaded", () => {
    const mediaBg = document.querySelectorAll(".media-is-bg")
    const isMobile = window.matchMedia("(width < 768px)").matches
    console.log("start check")

    console.log("Found media elements:", mediaBg.length)
    mediaBg.forEach((media) => {
        // Use mobile-specific media when provided
        const type = isMobile ? (media.dataset.typeMobile || media.dataset.type) : media.dataset.type
        const src = isMobile ? (media.dataset.srcMobile || media.dataset.src) : media.dataset.src
        const className = media.dataset.class || "media-is-bg"

        console.log(`Check type: ${type}`)
        console.log(`Check type: ${src}`)
        console.log(`Check type: ${className}`)

        if(!type || !src) {
            console.error("Missing data-type or data-src on media-bg")
            return;
        }

        let mediaElement

        if(type === "video") {
            console.log("start check video type")
            mediaElement = document.createElement("video")
            mediaElement.autoplay = true
            mediaElement.loop = true
            mediaElement.muted = true
            mediaElement.playsInline = true
            mediaElement.src = src
            mediaElement.preload = "metadata"
        }
        else if(type === "image") {
            mediaElement = document.createElement("img")
            mediaElement.src = src
            mediaElement.alt = "Image"
        }
        else {
            console.error(`Invalid type: ${type} | Only type "image" or "video"
                allowed`)
        }

        mediaElement.className = className

        mediaElement.style.cssText = media.style.cssText
        mediaElement.classList.add("media-loaded")
        media.replaceWith(mediaElement)

    })
})
