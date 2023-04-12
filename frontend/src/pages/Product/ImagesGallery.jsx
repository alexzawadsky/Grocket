import { SlideshowLightbox } from "lightbox.js-react"
import 'lightbox.js-react/dist/index.css'

const ImagesGallery = ({ images }) => {
    return (
        <SlideshowLightbox theme='lightbox' className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-5'>
            {images.map((el, key) => <img key={key} src={el.image} className='border-2 rounded-xl aspect-auto dark:border-zinc-600' />)}
        </SlideshowLightbox>
    )
}

export default ImagesGallery