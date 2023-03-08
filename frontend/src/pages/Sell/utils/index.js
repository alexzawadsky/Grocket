import { toBase64 } from "../../../utils"

export const deleteImage = (imageIndex, images, setMainImageIndex, setImages) => {
    if (images[imageIndex].is_main) {
        setMainImageIndex(0)
    }
    setImages(images.filter((el, key) => key !== imageIndex))
}

export const saveImage = async (editorRef, images, setImages, setCurrentImage, imageInputRef) => {
    const dataUrl = editorRef.current.getImage().toDataURL()
    const result = await fetch(dataUrl)
    const blob = await result.blob()
    const img_href = window.URL.createObjectURL(blob)
    const newImage = {
        is_main: images ? false : true,
        image: await toBase64(blob),
        image_href: img_href
    }
    if (images) {
        setImages([...images, newImage])
    } else {
        setImages([newImage])
    }
    imageInputRef.current.value = null
    setCurrentImage(null)
}