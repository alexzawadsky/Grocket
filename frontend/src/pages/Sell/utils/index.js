import { toBase64 } from "../../../utils"

export const deleteImage = (imageIndex, images, setMainImageIndex, setImages) => {
    if (images[imageIndex].is_main) {
        setMainImageIndex(0)
    }
    setImages(images.filter((el, key) => key !== imageIndex))
}

export const saveImage = (editorRef, images, setImages, setCurrentImage, imageInputRef, setUploading) => {
    try {
        setUploading(true)
        const img = new Image()
        img.src = editorRef.current.getImage().toDataURL()
        img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = 800
            canvas.height = 600
            const ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0, 800, 600)
            const newImage = {
                is_main: images.length > 0 ? false : true,
                image: canvas.toDataURL("image/png")
            }
            setImages([...images, newImage])
            imageInputRef.current.value = null
            setCurrentImage(null)
        }
        setUploading(false)
    } catch (e) {
        setUploading(false)
        alert(e)
    }
}

export const prepareImages = (images) => {
    return images.map(image =>
        Object.keys(image).includes('id') ? {
            image: image.id,
            is_main: image.is_main
        } : image
    )
}