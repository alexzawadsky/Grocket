import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../../api/api'
import { Title } from '../../components/ui'
import { SearchBar, ItemCard } from '../../components'
import CardModeToggle from './CardModeToggle'
import SortBy from './SortBy'
import useLocalStorage from '../../hooks/useLocalStorage'
import useScreen from '../../hooks/useScreen'
import cn from 'classnames'
import { Spinner } from '../../components/ui'

const Search = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [sortBy, setSortBy] = useState(searchParams.get('sortby') || 'price')
    const [isList, setIsList] = useLocalStorage('cardViewList', true)
    const { isMinTablet, isMinPC } = useScreen()
    const { data, isLoading, error } = useProducts(searchParams)

    return (
        <div className='grid gap-5'>
            <SearchBar />
            <Title className='pl-0 md:pl-5 lg:pl-0'>
                Products matching "{searchParams.get('search')}" ({data?.count || 0})
            </Title>
            <div className='lg:grid lg:grid-cols-[1fr_3fr]'>
                {isMinPC && <div>
                    filters
                </div>}
                <div>
                    <div className="mb-3 justify-between md:justify-start flex gap-3 items-center md:pl-5">
                        {isMinTablet && <CardModeToggle
                            state={isList}
                            setState={setIsList}
                        />}
                        <SortBy
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                        />
                    </div>
                    <div className={cn(
                        'bg-red',
                        !isList && 'max-md:gap-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                    )}>
                        {isLoading && <Spinner type={isList ? 'hcard' : 'vcard'} count={4} />}
                        {data && data?.results.map((product, key) =>
                            <ItemCard
                                search
                                key={key}
                                product={product}
                                horizontal={isList}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search