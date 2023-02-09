import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoBookOutline } from 'react-icons/io5'
import SearchHistoryContext from '../contexts/HistoryContext'
import { useContext } from 'react'
import { BsFillTrashFill, BsArrowRight } from 'react-icons/bs'

const HistoryItem = ({ content }) => {
    return (
        <NavLink to={`/product/${content.id}`} className='border-2 border-black rounded-lg p-5 flex gap-3 items-center shadow-lg'>
            <img src={content.img_urls[0]} className='w-1/4' />
            <div>
                <p className='text-lg hover:text-accent-orange'>{content.name}</p>
                <p className='font-bold'>{content.price}$</p>
            </div>
        </NavLink>
    )
}

const HistoryList = () => {

    const { lookHistory, clearHistory } = useContext(SearchHistoryContext)

    return (
        <div className='grid gap-5 w-64'>
            <h2 to='/history' className='text-2xl font-bold flex items-center gap-3'><IoBookOutline />You looked earlier</h2>
            <button onClick={clearHistory} className='border-2 border-accent-red flex items-center justify-center gap-5 text-accent-red py-3 rounded-xl hover:bg-accent-red/[0.1] font-bold'><BsFillTrashFill />Clear history</button>
            {lookHistory.slice(0, 4).map((el, key) => <HistoryItem key={key} content={el} />)}
            <NavLink className='flex items-center gap-5' to='/history'>View full history<BsArrowRight /></NavLink>
        </div>
    )
}

export default HistoryList