import React, { useContext } from 'react'
import { ItemCard } from '../../components'
import SearchHistoryContext from '../../contexts/HistoryContext'
import { BsFillTrashFill, BsArrowLeft } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SearchHistoryPage = () => {

    const { t } = useTranslation()
    const { lookHistory, clearHistory } = useContext(SearchHistoryContext)

    return (
        <div className='grid gap-5'>
            <h1 className='font-bold text-3xl'>{t('you_checked_earlier')}</h1>
            <div className="flex items-center justify-between md:justify-start md:gap-10">
                <NavLink className='flex items-center gap-3' to='/'><BsArrowLeft />{t('back_to_mainpage')}</NavLink>
                <button onClick={clearHistory} className='border-2 border-accent-red flex items-center justify-center gap-3 px-2 md:px-5 text-accent-red py-3 rounded-xl hover:bg-accent-red/[0.1] font-bold w-fit'><BsFillTrashFill />{t('clear_history')}</button>
            </div>
            <p className='font-bold'>{lookHistory.length === 0 && t('nothing_yet')}</p>
            <div className='grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                {lookHistory.map((el, key) => <ItemCard key={key} product={el} />)}
            </div>
        </div>
    )
}

export default SearchHistoryPage