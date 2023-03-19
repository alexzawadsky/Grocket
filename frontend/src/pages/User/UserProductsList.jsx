import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserProducts } from '../../api/api'
import { Spinner, Pagination, ItemCard } from '../../components'
import { useTranslation } from 'react-i18next'

const UserProductsList = ({ query }) => {

    const { t } = useTranslation()
    const [page, setPage] = useState(0)
    const { profileId } = useParams()
    const { isLoading, data, error } = useUserProducts(profileId, { ...query, page: page + 1 })

    if (isLoading) return <Spinner />
    if (error) return error.message
    if (data?.results?.length === 0) return t('no_results_found')

    return (
        <>
            <div className='grid gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {data.results.map((el, key) => <ItemCard key={key} product={el} managable={profileId === 'me'} />)}
            </div>
            <Pagination page={page} pagesCount={data.pages_count} setPage={setPage} />
        </>
    )
}

export default UserProductsList