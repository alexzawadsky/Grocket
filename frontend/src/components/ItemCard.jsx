import React from 'react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

const ItemCard = ({ content }) => {

    const [favourite, setFavourite] = useState(false)

    return (
        <div className='border-black border-2 rounded-2xl p-5 grid gap-2'>
            <img src={content.img_url} className='rounded-lg w-full' />
            <div className="flex items-center justify-between">
                <NavLink className='hover:text-accent-orange text-sm md:text-xl' to={`/item/${content.id}`}>{content.name}</NavLink>
                <button onClick={() => setFavourite(!favourite)}>{favourite ? <AiFillHeart color='#FF1500' /> : <AiOutlineHeart color='#FF9001' />}</button>
            </div>
            <p className='font-bolditalic text-xl'>{content.price}$</p>
            <div>
                <p className='text-primary-300'>{content.adress}</p>
                <p className='text-primary-100'>{content.pub_date}</p>
            </div>

        </div>
    )
}

export default ItemCard