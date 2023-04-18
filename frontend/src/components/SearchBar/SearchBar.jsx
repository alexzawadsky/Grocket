import { useState, useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { BiCategoryAlt } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import FullCategoriesList from './components/AllCagetoriesMenu'
import CategoriesListStateContext from '../../contexts/CategoriesListStateContext'
import { stateToQuery } from './utils'
import { IoClose } from 'react-icons/io5'
import useScreen from '../../hooks/useScreen'
import { Button, Form, Input } from '../ui'
import useInput from '../../hooks/useInput'

const SearchForm = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const search = useInput(searchParams.get('search') || '')
    const { t } = useTranslation()
    const { open, setOpen } = useContext(CategoriesListStateContext)
    const navigate = useNavigate()
    const { isMinTablet } = useScreen()

    return (
        <>
            <Form
                ariaLabel='search form'
                className='flex flex-col-reverse md:flex-row items-start md:items-center gap-3 md:gap-8 h-fit md:h-10 w-full'
                onSubmit={(e) => {
                    search.value && navigate(`/search?search=${stateToQuery(search.value.toLowerCase())}`)
                }}
            >
                <Button
                    className='max-md:!w-full whitespace-nowrap'
                    type='button'
                    onClick={() => setOpen(!open)}
                    style='outline'
                    color='accent-orange'
                    height={10}
                    px={5}
                >
                    {open ? <IoClose /> : <BiCategoryAlt />}
                    {t('categories')}
                </Button>
                <div className="flex items-center h-10 gap-3 md:gap-8 w-full" aria-label='input and submit button part'>
                    <Input
                        ariaLabel='search input for items search'
                        instance={search}
                        className='!border-2 !rounded-xl'
                        placeholder='eg. Iphone 14 Pro Max 512Gb'
                        containerClassName='grow'
                        type="text"
                    />
                    <Button
                        className='max-md:!w-11 max-md:!p-1 max-md:!px-2 whitespace-nowrap'
                        type='submit'
                        color='accent-orange'
                        style='fill'
                        height={10}
                        px={5}
                    >
                        <HiMagnifyingGlass />
                        {isMinTablet && t('search')}
                    </Button>
                </div>
            </Form>
            {open && <FullCategoriesList />}
        </>
    )
}

export default SearchForm