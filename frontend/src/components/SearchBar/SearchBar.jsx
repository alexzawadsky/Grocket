import { useState, useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { BiCategoryAlt } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import FullCategoriesList from './CategoriesList/AllCagetoriesMenu'
import CategoriesListStateContext from '../../contexts/CategoriesListStateContext'
import { stateToQuery } from './utils'
import { IoClose } from 'react-icons/io5'
import useScreen from '../../hooks/useScreen'

const Search = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const { t } = useTranslation()
    const { open, setOpen } = useContext(CategoriesListStateContext)
    const navigate = useNavigate()
    const { isMinTablet } = useScreen()

    useEffect(() => {
        setSearch(searchParams.get('search') || '')
    }, [searchParams.get('search')])

    return (
        <>
            <form
                className='flex flex-col-reverse md:flex-row items-start md:items-center gap-3 md:gap-8 h-fit md:h-10 bg-white w-full'
                onSubmit={(e) => {
                    e.preventDefault()
                    search && navigate(`/search?search=${stateToQuery(search)}`)
                }}
            >
                <button
                    className='button-outline-orange h-10 max-sm:!w-full whitespace-nowrap'
                    type='button'
                    onClick={() => setOpen(!open)}
                >
                    {open ? <IoClose /> : <BiCategoryAlt />}
                    {t('categories')}
                </button>
                <div className="flex items-center h-10 gap-3 md:gap-8 w-full">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='eg. Iphone 14 Pro Max 512Gb'
                        className='flex-grow rounded-xl border-slate-500 focus:border-slate-800 focus:shadow-md focus:outline-none border-2 px-4 w-full h-10'
                        type="text"
                    />
                    <button className='button-fill-orange h-10 max-sm:!w-11 max-sm:!p-1 max-sm:!px-2 whitespace-nowrap' type='submit'>
                        <HiMagnifyingGlass />
                        {isMinTablet && t('search')}
                    </button>
                </div>
            </form>
            {open && <FullCategoriesList />}
        </>
    )
}

export default Search