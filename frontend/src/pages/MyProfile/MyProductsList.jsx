import { useState, useEffect } from 'react'
import { useProductsMe } from '../../api/api'
import { Spinner, Pagination } from '../../components'
import MyLot from './MyLot'

const MyProductsList = ({ query }) => {

    const [page, setPage] = useState(0)

    const { isLoading, data, error } = useProductsMe({ ...query, page: page + 1 })

    if (isLoading) return <Spinner />
    if (error) return error.message
    if (data?.results?.length === 0) return 'No results found'

    return (
        <>
            <div className='grid gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {data.results.map((el, key) => <MyLot key={key} product={el} />)}
            </div>
            <Pagination page={page} pagesCount={data.pages_count} setPage={setPage} />
        </>
    )
}

export default MyProductsList