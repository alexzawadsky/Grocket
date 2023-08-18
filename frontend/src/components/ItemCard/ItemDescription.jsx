import cn from 'classnames'

const ItemDescription = ({ product, search, horizontal }) => {
    if (!(search && horizontal)) return
    return (
        <p
            className={cn(
                'overflow-hidden text-ellipsis',
                product?.promotions.includes('xl')
                    ? 'lg:text-md line-clamp-3 text-sm'
                    : 'line-clamp-2 text-sm'
            )}
        >
            {product?.description}
        </p>
    )
}

export default ItemDescription
