import { useRef, useEffect } from 'react'

const ChatEndMarker = ({ setOnBottom }) => {
    const bottomMarkerRef = useRef()

    useEffect(() => {
        const callback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setOnBottom(true)
                } else {
                    setOnBottom(false)
                }
            })
        }

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.0,
        }
        const observer = new IntersectionObserver(callback, options)

        if (bottomMarkerRef.current) {
            observer.observe(bottomMarkerRef.current)
        }

        return () => observer.disconnect()
    }, [])
    return <span ref={bottomMarkerRef} className="h-[1px]"></span>
}

export default ChatEndMarker
