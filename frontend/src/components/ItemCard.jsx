import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BiCategoryAlt, BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import useAxios from '../hooks/useAxios'
import { alertErr } from '../utils'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useMediaQuery } from 'react-responsive'

const ItemCard = ({ product }) => {

    const [isFavourite, setIsFavourite] = useState(product.is_favourite)
    const isPC = useMediaQuery({ query: '(min-width: 1024px)' })
    const api = useAxios()

    const handleFavourite = () => {
        api.post(`/`).then(res => product.id = res.data.state).catch(err => alertErr(err))
        console.log(product.id, 'toggle')
    }

    return (
        <div to={`/product/${product.id}`} className='border-black border-2 rounded-2xl overflow-hidden '>
            <NavLink to={`/products/${product.id}`} className="">
                <img src={product.images[0]} className='' />
            </NavLink>
            <div className='p-3 md:p-5 flex justify-around flex-col gap-2'>
                <div className="flex justify-between gap-2 max-h-12">
                    <div className='overflow-hidden'>
                        <NavLink to={`/products/${product.id}`} className='hover:text-accent-orange text-sm xl:text-lg'>{product.name}</NavLink>
                    </div>
                    <button onClick={() => setIsFavourite(prevState => !prevState)}>{isFavourite ? <AiFillHeart color='#FF1500' /> : <AiOutlineHeart color='#FF9001' />}</button>
                </div>
                <p className='font-bolditalic text-md xl:text-xl leading-none'>{product.price} {product.price_currency}</p>
                <div className='grid gap-y-1.5 xl:gap-y-1 grid-cols-[auto_1fr] gap-x-2 items-center'>
                    {isPC ? <><BiCategoryAlt /><p className='text-[0.6rem] xl:text-sm truncate'>{product.category.title}</p></> : null}
                    <FiMapPin />
                    <div className="overflow-hidden">
                        <p className='text-[0.6rem] xl:text-sm truncate'>{product.address}</p>
                    </div>
                    <BiTimeFive />
                    <div className="overflow-hidden">
                        <p className='text-[0.6rem] xl:text-sm truncate'>{product.pub_date}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemCard