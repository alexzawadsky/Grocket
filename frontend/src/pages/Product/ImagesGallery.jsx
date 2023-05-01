import { SlideshowLightbox } from 'lightbox.js-react'
import 'lightbox.js-react/dist/index.css'

const ImagesGallery = ({ images }) => {
    return (
        <SlideshowLightbox
            theme="lightbox"
            className="grid grid-cols-2 items-center gap-5 md:grid-cols-3 xl:grid-cols-4"
        >
            {images.map((el, key) => (
                <img
                    alt={`product image ${key + 1}`}
                    key={key}
                    src={el.image}
                    className="aspect-auto rounded-xl border-2 dark:border-zinc-600"
                />
            ))}
        </SlideshowLightbox>
    )
}

export default ImagesGallery
