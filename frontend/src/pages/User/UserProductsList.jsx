import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserProducts } from '../../api/api'
import { Spinner, Pagination, ItemCard } from '../../components'
import { useTranslation } from 'react-i18next'
import AuthContext from '../../contexts/AuthProvider'

const filterOptions = [
    {
        title: 'All',
        query: null,
        private: false
    },
    {
        title: 'Archived',
        query: { is_archived: true },
        private: true
    },
    {
        title: 'Sold',
        query: { is_sold: true },
        private: false
    },
]

const UserProductsList = () => {

    const { user } = useContext(AuthContext)
    const { t } = useTranslation()
    const [page, setPage] = useState(0)
    const { profileId } = useParams()
    const [query, setQuery] = useState(null)
    const { isLoading, data, error } = useUserProducts(profileId, { ...query, page: page + 1 })

    if (isLoading) return <Spinner />
    if (error) return error.message
    if (data?.results?.length === 0) return t('no_results_found')

    return (
        <div>
            <div className="flex items-center p-1 gap-1 rounded-xl border-2 w-fit ml-5">
                {filterOptions.map((el, key) =>
                    <div
                        key={key}
                        className={`rounded-lg cursor-pointer h-10 font-bold p-2 flex items-center justify-center hover:bg-slate-100 ${el.query === query && '!bg-slate-200'}`}
                        onClick={() => setQuery(el.query)}
                    >
                        {el.title}
                    </div>)}
            </div>
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-0'>
                {data.results.map((el, key) =>
                    <ItemCard
                        key={key}
                        product={el}
                        managable={el?.user?.id === user?.user_id}
                    />)}
            </div>
            {data.pages_count > 1 &&
                <div className='mx-auto mt-5'>
                    <Pagination page={page} pagesCount={data.pages_count} setPage={setPage} />
                </div>}
        </div>
    )
}

export default UserProductsList