export const deleteImage = (
    imageIndex,
    images,
    setMainImageIndex,
    setImages
) => {
    if (images[imageIndex].is_main) {
        setMainImageIndex(0)
    }
    setImages(images.filter((_, key) => key !== imageIndex))
}

export const prepareImages = (images) => {
    return (
        images &&
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
