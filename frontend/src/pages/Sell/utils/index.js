import { toBase64 } from "../../../utils"

export const deleteImage = (imageIndex, images, setMainImageIndex, setImages) => {
    if (images[imageIndex].is_main) {
        setMainImageIndex(0)
    }
    setImages(images.filter((el, key) => key !== imageIndex))
}

export const saveImage = async (editorRef, images, setImages, setCurrentImage, imageInputRef) => {
    const newImage = {
        is_main: images.length > 0 ? false : true,
        image: editorRef.current.getImage().toDataURL()
    }
    if (images) {
        setImages([...images, newImage])
    } else {
        setImages([newImage])
    }
    imageInputRef.current.value = null
    setCurrentImage(null)
}

export const prepareImages = (images) => {
    return images.map(image =>
        Object.keys(image).includes('id') ? {
            image: image.id,
            is_main: image.is_main
        } : image
    )
}