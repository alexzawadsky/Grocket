import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoBookOutline } from 'react-icons/io5'
import SearchHistoryContext from '../contexts/HistoryContext'
import { useContext } from 'react'
import { BsFillTrashFill, BsArrowRight } from 'react-icons/bs'
import { useMediaQuery } from 'react-responsive'

const HistoryItem = ({ content }) => {
    return (
        <NavLink to={`/products/${content.id}`} className='border-2 border-black rounded-lg p-5 flex gap-3 items-center shadow-lg w-fit'>
            <img src={content.img_urls[0]} className='w-1/4' />
            <div className='grid gap-0.5'>
                <p className='text-sm xl:text-lg hover:text-accent-orange'>{content.name}</p>
                <p className='font-bold'>{content.price} {content.price_currency}</p>
            </div>
        </NavLink>
    )
}

const HistoryList = () => {

    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })

    const { lookHistory, clearHistory } = useContext(SearchHistoryContext)

    return (
        <div className='grid gap-5 h-fit'>
            {isTablet ? (
                <>
                    <h2 to='/history' className='text-2xl font-bold flex items-center gap-3 text-truncate'><IoBookOutline />You looked earlier</h2>
                    <button onClick={clearHistory} className='button-outline-red !w-full justify-center'><BsFillTrashFill />Clear history</button>
                    {lookHistory.slice(0, 4).map((el, key) => <HistoryItem key={key} content={el} />)}
                </>
            ) : null}
            <NavLink className='flex items-center gap-5 hover:text-accent-orange' to='/history'>View full browsing history<BsArrowRight /></NavLink>
        </div>
    )
}

export default HistoryList