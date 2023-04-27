import { useState } from 'react'
import useScreen from '../../hooks/useScreen'

const ImagesCarousel = ({ images }) => {

    const [currentIndex, setCurrentIndex] = useState(0)
    const { isMinTabet } = useScreen()
    if (images.length === 0) return

    return (
        <div className='relative rounded-lg overflow-hidden'>
            <img aria-label='item card photo' src={images[currentIndex]?.image} />
            {isMinTabet && <div className='absolute w-full h-full left-0 top-0 flex' onMouseLeave={() => setCurrentIndex(0)}>
                {images.length > 1 && Array(images.length < 5 ? images.length : 5).fill(0).map((_, key) =>
                    <span
                        aria-hidden='true'
                        className='h-full hover:border-b-4 border-b-accent-orange transition-all'
                        style={{ width: `${100 / (images.length < 5 ? images.length : 5)}%` }}
                        key={key}
                        onMouseEnter={() => setCurrentIndex(key)}
                    >
                    </span>
                )}
            </div>}
        </div>
    )
}

export default ImagesCarousel