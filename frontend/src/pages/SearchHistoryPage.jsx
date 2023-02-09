import React, { useContext } from 'react'
import ItemCard from '../components/ItemCard'
import SearchHistoryContext from '../contexts/HistoryContext'
import { BsFillTrashFill, BsArrowLeft } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'

const SearchHistoryPage = () => {

    const { lookHistory, clearHistory } = useContext(SearchHistoryContext)

    return (
        <div className='grid gap-5'>
            <h1 className='font-bold text-3xl'>You've checked this products before</h1>
            <div className="flex items-center gap-10">
                <NavLink className='flex items-center gap-3' to='/'><BsArrowLeft />Back to main page</NavLink>
                <button onClick={clearHistory} className='border-2 border-accent-red flex items-center justify-center gap-3 px-5 text-accent-red py-3 rounded-xl hover:bg-accent-red/[0.1] font-bold w-fit'><BsFillTrashFill />Clear history</button>
            </div>
            <div className='grid gap-5 grid-cols-5'>
                {lookHistory.map((el, key) => <ItemCard content={el} />)}
            </div>
        </div>
    )
}

export default SearchHistoryPage