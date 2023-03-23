import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoBookOutline } from 'react-icons/io5'
import SearchHistoryContext from '../../contexts/HistoryContext'
import { useContext } from 'react'
import { BsFillTrashFill, BsArrowRight } from 'react-icons/bs'
import HistoryItem from './HistoryItem'
import useScreen from '../../hooks/useScreen'
import { useTranslation } from 'react-i18next'

const HistoryList = () => {

    const { t } = useTranslation()
    const { isMinTablet } = useScreen()
    const { lookHistory, clearHistory } = useContext(SearchHistoryContext)
    return (
        <div className='grid gap-5 h-fit'>
            {isMinTablet ? (
                <>
                    <h2 to='/history' className='text-2xl font-bold flex items-center gap-3 text-truncate'>
                        <IoBookOutline />
                        {t('you_looked_earlier')}
                        {/* <button
                            onClick={clearHistory}
                            className='text-accent-red ml-auto'
                        >
                            <BsFillTrashFill />
                        </button> */}
                    </h2>
                    <button
                        onClick={clearHistory}
                        className='button-outline-red !w-full justify-center'
                    >
                        <BsFillTrashFill />{t('clear_history')}
                    </button>
                </>
            ) : null}
            <div>
                {isMinTablet && lookHistory.slice(0, 4).map((el, key) =>
                    <HistoryItem key={key} content={el} />)}
                <NavLink
                    className='flex items-center gap-3 hover:gap-5 transition-all hover:text-accent-orange mt-2 leading-none md:pl-3'
                    to='/history'
                >
                    {t('view_full_history')}<BsArrowRight />
                </NavLink>
            </div>
        </div>
    )
}

export default HistoryList