import React, { useContext } from 'react'
import { ItemCard } from '../../components'
import SearchHistoryContext from '../../contexts/HistoryContext'
import { BsFillTrashFill, BsArrowLeft } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

const SearchHistoryPage = () => {
    const { t } = useTranslation()
    const { lookHistory, clearHistory } = useContext(SearchHistoryContext)

    return (
        <>
            <Helmet>
                <title>Products browsing history - Grocket</title>
            </Helmet>
            <h1 className="text-3xl font-bold">{t('you_checked_earlier')}</h1>
            <div className="flex items-center justify-between md:justify-start md:gap-10 md:pl-5">
                <NavLink className="flex items-center gap-3" to="/">
                    <BsArrowLeft />
                    {t('back_to_mainpage')}
                </NavLink>
                <button
                    onClick={clearHistory}
                    className="flex w-fit items-center justify-center gap-3 rounded-xl border-2 border-accent-red px-2 py-3 font-bold text-accent-red hover:bg-accent-red/[0.1] md:px-5"
                >
                    <BsFillTrashFill />
                    {t('clear_history')}
                </button>
            </div>
            {lookHistory.length === 0 && (
                <p className="pt-5 font-bold">{t('nothing_yet')}</p>
            )}
            <ul className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-0 md:pt-0 lg:grid-cols-5">
                {lookHistory.map((el, key) => (
                    <li>
                        <ItemCard key={key} product={el} />
                    </li>
                ))}
            </ul>
        </>
    )
}

export default SearchHistoryPage
