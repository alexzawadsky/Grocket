import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../../api/api'
import { Button, Title } from '../../components/ui'
import { SearchBar, ItemCard } from '../../components'
import CardModeToggle from './CardModeToggle'
import SortBy from './SortBy'
import useLocalStorage from '../../hooks/useLocalStorage'
import useScreen from '../../hooks/useScreen'
import cn from 'classnames'
import { Spinner } from '../../components/ui'
import Filters from './Filters'
import { BiFilterAlt } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'

const Search = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [isList, setIsList] = useLocalStorage('cardViewList', true)
    const { isMinTablet, isMinPC } = useScreen()
    const { data, isLoading, error } = useProducts(searchParams)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <div className='grid gap-5'>
            <SearchBar />
            <div>
                <Title className='pl-0 md:pl-5 lg:pl-0'>
                    Products matching "{searchParams.get('search')}" ({data?.count || 0})
                </Title>
                <div className='lg:grid lg:grid-cols-[1fr_3fr] gap-5 mt-5'>
                    {isMinPC && <Filters mnP={data?.min_price} mxP={data?.max_price} />}
                    <div>
                        <div className="justify-between md:justify-start flex gap-3 items-center md:pl-5 bg-white dark:bg-zinc-800">
                            {isMinTablet && <CardModeToggle
                                state={isList}
                                setState={setIsList}
                            />}
                            <SortBy />
                            {!isMinPC && <Button
                                height={10}
                                px={2}
                                className='ml-auto dark:border-zinc-600 hover:dark:bg-zinc-700 !border-2'
                                onClick={() => setFiltersOpen(prevState => !prevState)}
                            >
                                <BiFilterAlt />{t('filters')}
                            </Button>}
                        </div>
                        <ul className={cn(
                            'bg-red relative max-w-full overflow-hidden mt-5',
                            !isList && 'max-md:gap-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                        )}>
                            {!isMinPC && <Filters
                                open={filtersOpen}
                                mnP={data?.min_price}
                                mxP={data?.max_price}
                            />}
                            {isLoading && <Spinner
                                type={isMinTablet ? isList ? 'hcard' : 'vcard' : 'vcard'}
                                count={isMinTablet ? 4 : 1}
                            />}
                            {data && data?.results.map((product, key) => <li key={key}>
                                <ItemCard
                                    search
                                    product={product}
                                    horizontal={isList}
                                />
                            </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Search