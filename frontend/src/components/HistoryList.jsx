import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoBookOutline } from 'react-icons/io5'

const item = {
    name: 'Iphone 11',
    price: '1231',
    id: 121212,
    img_url: 'iphone.jpg'
}

const HistoryItem = ({ content }) => {
    return (
        <div className='border-2 border-black rounded-lg p-5 flex gap-3 items-center shadow-lg'>
            <img src={content.img_url} className='w-1/4' />
            <div>
                <NavLink className='text-lg hover:text-accent-orange' to={`/item/${content.id}`}>{content.name}</NavLink>
                <p className='font-bold'>{content.price}$</p>
            </div>
        </div>
    )
}

const HistoryList = () => {
    return (
        <div className='grid gap-5 w-64'>
            <h2 className='text-2xl font-bold flex items-center gap-3'><IoBookOutline />You looked earlier</h2>
            {Array(3).fill(0).map((el, key) => <HistoryItem key={key} content={item} />)}
        </div>
    )
}

export default HistoryList