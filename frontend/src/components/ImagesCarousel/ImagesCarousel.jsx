import { useState } from 'react'

const ImagesCarousel = ({ images, sold }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!images || images.length === 0) return <p>no images</p>
    return (
        <div className="relative overflow-hidden rounded-lg">
            <img
                aria-label="item card photo"
                src={images[currentIndex]?.image}
                className={sold ? ' contrast-[0.25] saturate-50' : null}
            />
            <div
                className="absolute left-0 top-0 hidden h-full w-full md:flex"
                onMouseLeave={() => setCurrentIndex(0)}
            >
                {images.length > 1 &&
                    Array(images.length < 5 ? images.length : 5)
                        .fill(0)
                        .map((_, key) => (
                            <span
                                aria-hidden="true"
                                className="h-full border-b-accent-orange transition-all hover:border-b-4"
                                style={{
                                    width: `${
                                        100 /
                                        (images.length < 5 ? images.length : 5)
                                    }%`,
                                }}
                                key={key}
                                onMouseEnter={() => setCurrentIndex(key)}
                            ></span>
                        ))}
            </div>
        </div>
    )
}

export default ImagesCarousel
