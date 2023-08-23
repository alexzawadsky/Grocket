import { useRef, useEffect } from 'react'
import { Spinner } from '../../../components/ui'

const LoadMoreMarker = ({ isFetching, error, fetch, hasNextPage }) => {
    const loadMoreMarkerRef = useRef()

    useEffect(() => {
        const callback = (entries) => {
            if (
                entries[0].isIntersecting &&
                !isFetching &&
                hasNextPage &&
                !error
            ) {
                fetch()
            }
        }

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.0,
        }
        const observer = new IntersectionObserver(callback, options)

        if (loadMoreMarkerRef.current) {
            observer.observe(loadMoreMarkerRef.current)
        }

        return () => observer.disconnect()
    }, [isFetching, hasNextPage, error, fetch])

    return (
        <span className="mx-auto min-h-[1px] min-w-[1px]">
            {isFetching && <Spinner />}
            {error && 'error'}
            <span
                ref={loadMoreMarkerRef}
                className="block min-h-[1px] min-w-[1px]"
            ></span>
        </span>
    )
}

export default LoadMoreMarker
