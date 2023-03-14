import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoBookOutline } from 'react-icons/io5'
import SearchHistoryContext from '../../contexts/HistoryContext'
import { useContext } from 'react'
import { BsFillTrashFill, BsArrowRight } from 'react-icons/bs'
import HistoryItem from './HistoryItem'
import useScreen from '../../hooks/useScreen'

const HistoryList = () => {

    const { isMinTablet } = useScreen()
    const { lookHistory, clearHistory } = useContext(SearchHistoryContext)

    return (
        <div className='grid gap-5 h-fit'>
            {isMinTablet ? (
                <>
                    <h2 to='/history' className='text-2xl font-bold flex items-center gap-3 text-truncate'><IoBookOutline />You looked earlier</h2>
                    <button onClick={clearHistory} className='button-outline-red !w-full justify-center'><BsFillTrashFill />Clear history</button>
                    {lookHistory.slice(0, 4).map((el, key) => <HistoryItem key={key} content={el} />)}
                </>
            ) : null}
            <NavLink className='flex items-center gap-3 hover:gap-5 transition-all hover:text-accent-orange' to='/history'>View full browsing history<BsArrowRight /></NavLink>
        </div>
    )
}

export default HistoryList