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
    const { isMinTablet, isLargePC } = useScreen()
    const { lookHistory, clearHistory } = useContext(SearchHistoryContext)

    return (
        <aside className='grid gap-2 h-fit' aria-label='list of items you opened recently'>
            {isMinTablet &&
                <>
                    <h2 to='/history' className='text-lg lg:text-xl xl:text-2xl font-bold flex items-center gap-3 text-truncate'>
                        <IoBookOutline />
                        {t('you_looked_earlier')}
                    </h2>
                    {lookHistory.length > 0 && <button
                        onClick={clearHistory}
                        className='flex items-center gap-2 text-accent-red ml-2 mt-3'
                    >
                        <BsFillTrashFill />{t('clear_history')}
                    </button>}
                </>}
            {isMinTablet && <ul aria-label='items history list'>
                {lookHistory.length === 0 ?
                    <p className='pt-2 pl-2'>{t('nothing_yet')}</p>
                    :
                    lookHistory.slice(0, 4).map((el, key) =>
                        <HistoryItem
                            key={key}
                            product={el}
                        />)
                }
            </ul>}
            {lookHistory.length > 0 && <NavLink
                className={`text-md ${(isMinTablet && !isLargePC) && '!text-sm'} flex items-center gap-3 hover:gap-5 transition-all hover:text-accent-orange mb-5 leading-none md:pl-3`}
                to='/history'
            >
                {t('view_full_history')}<BsArrowRight />
            </NavLink>}
        </aside>
    )
}

export default HistoryList