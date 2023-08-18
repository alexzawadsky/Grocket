import useScreen from '../../hooks/useScreen'
import ImagesCarousel from '../ImagesCarousel/ImagesCarousel'

const ItemImages = ({ product, search, horizontal }) => {
    const { isMinTablet } = useScreen()
    const isXL = product?.promotions.includes('xl')

    if (((isXL && !isMinTablet) || (isXL && horizontal)) && search)
        return (
            <div className="grid grid-cols-2 gap-1">
                <img
                    className="col-span-full rounded-lg"
                    src={product?.images[0]?.image}
                />
                <img className="rounded-lg" src={product?.images[1]?.image} />
                <img className="rounded-lg" src={product?.images[2]?.image} />
            </div>
        )
    return <ImagesCarousel images={product?.images} sold={product?.is_sold} />
}

export default ItemImages
