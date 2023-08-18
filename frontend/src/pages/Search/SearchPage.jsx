import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../../api/api'
import { Button, Title, Spinner, Pagination } from '../../components/ui'
import { SearchBar, ItemCard } from '../../components'
import CardModeToggle from './CardModeToggle'
import SortBy from './SortBy'
import useLocalStorage from '../../hooks/useLocalStorage'
import useScreen from '../../hooks/useScreen'
import cn from 'classnames'
import Filters from './Filters'
import { BiFilterAlt } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import NoResults from '../../components/Placeholders/NoResults'
import NoResponse from '../../components/Placeholders/NoResponse'

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [isList, setIsList] = useLocalStorage('cardViewList', true)
    const { isMinTablet, isMinPC } = useScreen()
    const [page, setPage] = useState(0)
    searchParams.append('page', page + 1)
    const { data, isLoading, error } = useProducts(searchParams)
    const [filtersOpen, setFiltersOpen] = useState(false)

    const { t } = useTranslation()

    const filters = (
        <Filters
            setPage={setPage}
            setOpen={setFiltersOpen}
            open={filtersOpen}
            mnP={data?.min_price}
            mxP={data?.max_price}
            productsCountries={data?.countries}
        />
    )

    return (
        <>
            <SearchBar />
            <Title className="flex pl-0 !text-2xl md:pl-5 md:!text-3xl lg:pl-0">
                {t('products_matching')} "
                {searchParams.get('search')
                    ? searchParams.get('search')
                    : data?.category
                    ? data?.category
                    : t('loading')}
                " ({data?.count || 0})
            </Title>
            <div className="gap-5 lg:grid lg:grid-cols-[1fr_3fr]">
                {isMinPC && filters}
                <div>
                    <div className="mb-5 flex items-center justify-between gap-3 bg-white dark:bg-zinc-800 md:justify-start md:pl-5">
                        {isMinTablet && (
                            <CardModeToggle
                                state={isList}
                                setState={setIsList}
                            />
                        )}
                        <SortBy setPage={setPage} />
                        {!isMinPC && (
                            <Button
                                height={10}
                                px={2}
                                className="ml-auto !border-2 dark:border-zinc-600 hover:dark:bg-zinc-700"
                                onClick={() =>
                                    setFiltersOpen((prevState) => !prevState)
                                }
                            >
                                <BiFilterAlt />
                                {t('filters')}
                            </Button>
                        )}
                    </div>
                    <ul
                        className={cn(
                            !data?.count && 'min-h-[70vh]',
                            'bg-red relative grid max-w-full overflow-hidden max-md:gap-5',
                            !isList &&
                                'max-md:gap-2 md:grid-cols-3 xl:grid-cols-4'
                        )}
                    >
                        {!isMinPC && filters}
                        {isLoading ? (
                            <Spinner
                                type={
                                    isMinTablet
                                        ? isList
                                            ? 'hcard'
                                            : 'vcard'
                                        : 'vcard'
                                }
                                count={isMinTablet ? 4 : 1}
                            />
                        ) : error ? (
                            error.response.status.toString()[0] === '5' ? (
                                <NoResponse className="mx-auto" />
                            ) : (
                                error?.message
                            )
                        ) : !data?.count ? (
                            <NoResults className="md:pl-5" />
                        ) : (
                            data?.results.map((product, key) => (
                                <li key={key}>
                                    <ItemCard
                                        search
                                        product={product}
                                        horizontal={isList}
                                    />
                                </li>
                            ))
                        )}
                    </ul>
                    {data?.pages_count > 1 && (
                        <Pagination
                            className="max-md:mx-auto md:ml-5 md:mt-2"
                            page={page}
                            setPage={setPage}
                            pagesCount={data?.pages_count}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default Search
