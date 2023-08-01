import React, { Suspense, lazy } from 'react'
import { NavLink } from 'react-router-dom'
import { IoBookOutline } from 'react-icons/io5'
import SearchHistoryContext from '../../contexts/HistoryContext'
import { useContext } from 'react'
import { BsFillTrashFill, BsArrowRight } from 'react-icons/bs'
import useScreen from '../../hooks/useScreen'
import { useTranslation } from 'react-i18next'
const HistoryItem = lazy(() => import('./HistoryItem'))

const HistoryList = () => {
    const { t } = useTranslation()
    const { isMinTablet, isLargePC } = useScreen()
    const { lookHistory, clearHistory } = useContext(SearchHistoryContext)

    return (
        <aside
            className="top-20 z-40 grid h-fit gap-2 md:sticky"
            aria-label="list of items you opened recently"
        >
            {isMinTablet && (
                <>
                    <h2
                        to="/history"
                        className="text-truncate flex items-center gap-3 text-lg font-bold lg:text-xl xl:text-2xl"
                    >
                        <IoBookOutline />
                        {t('you_looked_earlier')}
                    </h2>
                    {lookHistory.length ? (
                        <button
                            onClick={clearHistory}
                            className="ml-2 mt-3 flex items-center gap-2 text-accent-red"
                        >
                            <BsFillTrashFill />
                            {t('clear_history')}
                        </button>
                    ) : null}
                </>
            )}
            <Suspense>
                {isMinTablet &&
                    (lookHistory.length ? (
                        <ul aria-label="items history list">
                            {lookHistory.slice(0, 4).map((el, key) => (
                                <HistoryItem key={key} product={el} />
                            ))}
                        </ul>
                    ) : (
                        <span className="pl-8 xl:pl-[38px]">
                            <i>{t('nothing_yet')}</i>
                        </span>
                    ))}
            </Suspense>
            {lookHistory.length > 4 ||
                (lookHistory.length && !isMinTablet ? (
                    <NavLink
                        className={`text-md ${
                            isMinTablet && !isLargePC && '!text-sm'
                        } mb-5 flex items-center gap-3 leading-none transition-all hover:gap-5 hover:text-accent-orange md:pl-3`}
                        to="/history"
                    >
                        {t('view_full_history')}
                        <BsArrowRight />
                    </NavLink>
                ) : null)}
        </aside>
    )
}

export default HistoryList
