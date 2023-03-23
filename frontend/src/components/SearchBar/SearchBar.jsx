import { useState, useContext, useEffect } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { BiCategoryAlt } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import FullCategoriesList from './CategoriesList/AllCagetoriesMenu'
import CategoriesListStateContext from '../../contexts/CategoriesListStateContext'
import { stateToQuery } from './utils'

const Search = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('q') || '')
    const { t } = useTranslation()
    const { open, setOpen } = useContext(CategoriesListStateContext)
    const navigate = useNavigate()

    useEffect(() => {
        setSearch(searchParams.get('q') || '')
    }, [searchParams.get('q')])

    return (
        <div className='w-full'>
            <form
                className='flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-8 h-fit md:h-10 bg-white w-full'
                onSubmit={(e) => {
                    e.preventDefault()
                    search && navigate(`/search?q=${stateToQuery(search)}`)
                }}
            >
                <button
                    className='button-outline-orange h-10'
                    type='button'
                    onClick={() => setOpen(!open)}
                >
                    <BiCategoryAlt />
                    {t('categories')}
                </button>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='eg. Iphone 14 Pro Max 512Gb'
                    className='flex-grow h-full rounded-xl border-slate-500 focus:border-slate-800 focus:shadow-md focus:outline-none border-2 px-4 w-full'
                    type="text"
                />
                <button
                    className='button-fill-orange h-10 max-md:w-full max-md:justify-center'
                    type='submit'
                >
                    <HiMagnifyingGlass />
                    {t('search')}
                </button>
            </form>
            <div className={open && 'mt-3'}>
                <FullCategoriesList />
            </div>
        </div>
    )
}

export default Search