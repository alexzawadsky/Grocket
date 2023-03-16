import React from 'react'
import { useTranslation } from 'react-i18next'
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs'
import ReactPaginate from 'react-paginate'
import { useMediaQuery } from 'react-responsive'

const Pagination = ({ page, pagesCount, setPage }) => {

    const { t } = useTranslation()
    const isPhone = useMediaQuery({ query: '(max-width: 639px)' })

    return (
        <ReactPaginate
            initialPage={page}
            pageCount={pagesCount}
            pageRangeDisplayed={isPhone ? 1 : 3}
            marginPagesDisplayed={isPhone ? 1 : 3}
            onPageChange={(page) => setPage(page.selected)}
            className='flex gap-5'
            activeClassName='font-bold'
            pageClassName='[&:not(.font-bold)]:hover:text-accent-orange'
            previousClassName='text-accent-orange font-bold'
            nextClassName='text-accent-orange font-bold'
            previousLabel={<p className='flex items-center gap-2'><BsArrowLeft />{t('prev')}</p>}
            nextLabel={<p className='flex items-center gap-2'>{t('next')}<BsArrowRight /></p>}
        />
    )
}

export default Pagination