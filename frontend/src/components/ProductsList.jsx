import { useState, useEffect } from 'react'
import { useProducts } from '../api/api'
import { Spinner, ItemCard, Pagination } from '.'
import { useTranslation } from 'react-i18next'

const ProductsList = ({ query }) => {

    const { t } = useTranslation()
    const [page, setPage] = useState(0)

    const { isLoading, data, error } = useProducts({ ...query, page: page + 1 })

    if (isLoading) return <Spinner />
    if (error) return error.message
    if (data?.results?.length === 0) return t('no_results_found')

    return (
        <>
            <div className='grid grid-cols-2 gap-5 md:gap-0 lg:grid-cols-3 xl:grid-cols-4'>
                {data.results.map((el, key) => <ItemCard key={key} product={el} managable={false} />)}
            </div>
            <div className='mx-auto mt-5'>
                <Pagination page={page} pagesCount={data.pages_count} setPage={setPage} />
            </div>

        </>
    )
}

export default ProductsList