import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import ReactPaginate from 'react-paginate'
import useScreen from '../../hooks/useScreen'
import cn from 'classnames'

const Pagination = ({ className, page, pagesCount, setPage }) => {

    const { isMinTablet } = useScreen()

    return <ReactPaginate
        onClick={() => window.scrollTo(0, 0)}
        forcePage={page}
        pageCount={pagesCount}
        pageRangeDisplayed={!isMinTablet ? 1 : 3}
        marginPagesDisplayed={!isMinTablet ? 1 : 3}
        onPageChange={page => setPage(page.selected)}
        className={cn(
            'flex gap-1 p-1 w-fit items-center border-2 dark:border-zinc-600 rounded-xl',
            className
        )}
        pageLinkClassName='[&:not(.bg-slate-200)]:hover:bg-slate-100 dark:[&:not(.bg-zinc-600)]:hover:bg-zinc-700 rounded-lg w-10 h-10 flex items-center justify-center'
        activeLinkClassName='!bg-slate-200 dark:!bg-zinc-600'
        previousLinkClassName='text-white text-lg font-bold rounded-lg bg-accent-orange hover:bg-accent-orange/[0.8] flex items-center justify-center h-10 w-10'
        nextLinkClassName='text-white text-lg font-bold rounded-lg bg-accent-orange hover:bg-accent-orange/[0.8] flex items-center justify-center h-10 w-10'
        previousLabel={<IoIosArrowBack />}
        nextLabel={<IoIosArrowForward />}
    />
}

export default Pagination