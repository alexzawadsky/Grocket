import { useState, useEffect } from 'react'
import { useProducts } from '../../api/api'
import { Spinner, ItemCard, Pagination } from '../../components'

const ProductsList = () => {

    const [page, setPage] = useState(0)

    const { isLoading, data, error } = useProducts(page)

    if (isLoading) return <Spinner />
    if (error) return error.message

    return (
        <>
            <div className='grid gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {data.results.map((el, key) => <ItemCard key={key} product={el} />)}
            </div>
            <Pagination pagesCount={data.pages_count} setPage={setPage} />
        </>
    )
}

export default ProductsList