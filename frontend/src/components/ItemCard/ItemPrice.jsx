import React from 'react'
import { Price } from '../ui'

const ItemPrice = ({ product, search }) => {
    if (search && product?.promotions.includes('price'))
        return (
            <span className="relative ml-1.5 inline-block px-1 before:absolute before:-inset-1 before:block before:-skew-x-[10deg] before:rounded-sm before:bg-accent-orange">
                <span className="relative text-white">
                    <Price
                        className="font-bolditalic text-lg leading-none lg:text-2xl"
                        price={product?.price}
                    />
                </span>
            </span>
        )

    return (
        <Price
            className="text-md font-bolditalic leading-none lg:text-xl"
            price={product?.price}
        />
    )
}

export default ItemPrice
