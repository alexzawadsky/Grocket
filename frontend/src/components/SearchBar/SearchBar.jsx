import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { BiCategoryAlt, BiTimeFive } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import FullCategoriesList from './components/AllCagetoriesMenu'
import CategoriesListStateContext from '../../contexts/CategoriesListStateContext'
import { stateToQuery } from './utils'
import { IoClose } from 'react-icons/io5'
import useScreen from '../../hooks/useScreen'
import { Button, Form, Input } from '../ui'
import useInput from '../../hooks/useInput'
import SearchHistoryContext from '../../contexts/HistoryContext'

const SearchForm = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const search = useInput(searchParams.get('search') || '')
    const { t, i18n } = useTranslation()
    const { open, setOpen } = useContext(CategoriesListStateContext)
    const navigate = useNavigate()
    const { isMinTablet } = useScreen()
    const { setSearchHistory, getFilteredHistory } =
        useContext(SearchHistoryContext)
    const [inputFocused, setInputFocused] = useState(false)

    useEffect(() => {
        !searchParams.get('search') && search.setValue('')
    }, [window.location.href])

    return (
        <>
            <Form
                ariaLabel="search form"
                className="flex h-fit w-full flex-col-reverse items-start gap-3 md:h-10 md:flex-row md:items-center md:gap-8"
                onSubmit={(e) => {
                    if (!search.value) return
                    setSearchHistory((prevState) => {
                        if (prevState.includes(search.value)) return prevState
                        return [search.value.toLowerCase(), ...prevState]
                    })
                    setInputFocused(false)
                    navigate(
                        `/search?search=${stateToQuery(
                            search.value.toLowerCase()
                        )}`
                    )
                    document.getElementById('search-input').blur()
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
                    <div
                        className="relative grow"
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                    >
                        <Input
                            id="search-input"
                            ariaLabel="search input for items search"
                            instance={search}
                            className="!rounded-xl !border-2"
                            placeholder={`${t('eg.')} Apple Watch Ultra`}
                            type="text"
                            autocomplete="off"
                        />
                        {inputFocused &&
                        getFilteredHistory(search.value).length ? (
                            <ul className="absolute z-50 mt-3 w-full gap-1 rounded-xl border bg-white p-1 dark:border-2 dark:border-zinc-500 dark:bg-zinc-700">
                                {getFilteredHistory(search.value)
                                    .slice(0, 5)
                                    .map((el, key) => (
                                        <Link
                                            className="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-3 hover:bg-zinc-50 dark:hover:bg-zinc-600"
                                            to={`/search?search=${stateToQuery(
                                                el
                                            )}`}
                                            key={key}
                                        >
                                            <BiTimeFive />
                                            {el}
                                            <Button
                                                className="ml-auto"
                                                border={false}
                                                onClick={() =>
                                                    setSearchHistory(
                                                        (prevState) =>
                                                            prevState.filter(
                                                                (s) => s !== el
                                                            )
                                                    )
                                                }
                                                px={2}
                                            >
                                                <IoClose />
                                            </Button>
                                        </Link>
                                    ))}
                                {/* {getFilteredHistory(search.value).length >
                                    5 && (
                                    <p className="pl-[42px] font-bold">. . .</p>
                                )} */}
                            </ul>
                        ) : null}
                    </div>
                    <Button
                        className="whitespace-nowrap max-md:!w-11 max-md:!p-1 max-md:!px-2"
                        type="submit"
                        color="accent-orange"
                        style="fill"
                        height={10}
                        px={5}
                        ariaLabel="submit search"
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
