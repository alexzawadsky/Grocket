import React from 'react'
import { useTranslation } from 'react-i18next'
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
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
            className='flex gap-1 p-1 w-fit items-center border-2 rounded-xl'
            pageLinkClassName='[&:not(.bg-slate-200)]:hover:bg-slate-100 rounded-lg w-10 h-10 flex items-center justify-center'
            activeClassName='!bg-slate-200 font-bold rounded-lg'
            previousClassName='font-bold rounded-lg bg-accent-orange flex items-center justify-center h-10 w-10'
            nextClassName='font-bold rounded-lg bg-accent-orange flex items-center justify-center h-10 w-10'
            previousLabel={<p className='flex items-center gap-2'><IoIosArrowBack /></p>}
            nextLabel={<p className='flex items-center gap-2'><IoIosArrowForward /></p>}
        />
    )
}

export default Pagination