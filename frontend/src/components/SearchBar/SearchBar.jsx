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
import { useProducts } from '../../api/api'

const SearchForm = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const search = useInput(searchParams.get('search') || '')
    const { t } = useTranslation()
    const { open, setOpen } = useContext(CategoriesListStateContext)
    const navigate = useNavigate()
    const { isMinTablet } = useScreen()
    const { data } = useProducts(new URLSearchParams({ page: 1 }))

    useEffect(() => {
        !searchParams.get('search') && search.setValue('')
    }, [window.location.href])

    return (
        <>
            <Form
                ariaLabel="search form"
                className="flex h-fit w-full flex-col-reverse items-start gap-3 md:h-10 md:flex-row md:items-center md:gap-8"
                onSubmit={(e) => {
                    search.value &&
                        navigate(
                            `/search?search=${stateToQuery(
                                search.value.toLowerCase()
                            )}`
                        )
                    setOpen(false)
                }}
            >
                <Button
                    className="whitespace-nowrap max-md:!w-full"
                    type="button"
                    onClick={() => setOpen(!open)}
                    style="outline"
                    color="accent-orange"
                    height={10}
                    px={5}
                >
                    {open ? <IoClose /> : <BiCategoryAlt />}
                    {t('categories')}
                </Button>
                <div
                    className="flex h-10 w-full items-center gap-3 md:gap-8"
                    aria-label="input and submit button part"
                >
                    <Input
                        ariaLabel="search input for items search"
                        instance={search}
                        className="!rounded-xl !border-2"
                        placeholder={`${t('eg.')} Apple Watch Ultra`}
                        containerClassName="grow"
                        type="text"
                    />
                    <Button
                        className="whitespace-nowrap max-md:!w-11 max-md:!p-1 max-md:!px-2"
                        type="submit"
                        color="accent-orange"
                        style="fill"
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
