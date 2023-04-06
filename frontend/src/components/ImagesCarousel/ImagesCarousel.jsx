import { useState } from 'react'

const ImagesCarousel = ({ images }) => {

    const [currentIndex, setCurrentIndex] = useState(0)
    if (images.length === 0) return

    return (
        <div className='relative rounded-lg overflow-hidden'>
            <img src={images[currentIndex]?.image} />
            <div className='absolute w-full h-full left-0 top-0 flex' onMouseLeave={() => setCurrentIndex(0)}>
                {images.length > 1 && Array(images.length).fill(0).map((_, key) =>
                    <span
                        className='h-full hover:border-b-4 hover:border-b-accent-orange transition-all'
                        style={{ width: `${100 / images.length}%` }}
                        key={key}
                        onMouseEnter={() => setCurrentIndex(key)}
                    >
                    </span>
                )}
            </div>
        </div>
    )
}

export default ImagesCarousel