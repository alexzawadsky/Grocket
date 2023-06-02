export const deleteImage = (
    imageIndex,
    images,
    setMainImageIndex,
    setImages
) => {
    const clearedImages = images.filter((_, key) => key !== imageIndex)
    if (images[imageIndex].is_main) {
        if (images.length > 1) clearedImages[0].is_main = true
        setMainImageIndex(0)
    }
    setImages(clearedImages)
}

export const prepareImages = (images) => {
    return (
        images.map((image) =>
            Object.keys(image).includes('id')
                ? {
                    image: image.id,
                    is_main: image.is_main,
                }
                : image
        )
    )
}
