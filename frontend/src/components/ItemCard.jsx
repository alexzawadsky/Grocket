import React from 'react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

const ItemCard = ({ content }) => {

    return (
        <NavLink to={`/product/${content.id}`} className='border-black border-2 rounded-2xl p-3 lg:p-5 grid gap-0.5 lg:gap-2 shadow-lg w-fit'>
            <img src={content.img_urls[0]} className='rounded-lg w-full' />
            <div className="flex items-center justify-between">
                <p className='hover:text-accent-orange text-sm md:text-xl'>{content.name}</p>
                {/* <button onClick={() => setFavourite(!favourite)}>{favourite ? <AiFillHeart color='#FF1500' /> : <AiOutlineHeart color='#FF9001' />}</button> */}
            </div>
            <p className='font-bolditalic text-xl'>{content.price}$</p>
            <div>
                <p className='text-primary-300'>{content.adress}</p>
                <p className='text-primary-100'>{content.pub_date}</p>
            </div>

        </NavLink>
    )
}

export default ItemCard