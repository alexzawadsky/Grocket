import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserProducts } from '../../api/api'
import { ItemCard } from '../../components'
import { Spinner, Pagination } from '../../components/ui'
import { useTranslation } from 'react-i18next'
import AuthContext from '../../contexts/AuthProvider'
import { AiFillHeart } from 'react-icons/ai'

const UserProductsList = () => {

    const { t } = useTranslation()

    const filterOptions = [
        {
            title: t('active'),
            query: null,
            private: false
        },
        {
            title: t('archived'),
            query: { is_archived: true },
            private: true
        },
        {
            title: t('sold'),
            query: { is_sold: true },
            private: false
        },
        {
            title: <><AiFillHeart color={'red'} />{t('favourites')}</>,
            query: { is_favourited: true },
            private: true
        }
    ]

    const { user } = useContext(AuthContext)
    const [page, setPage] = useState(0)
    const { profileId } = useParams()
    const [query, setQuery] = useState(null)
    const { isLoading, data, error } = useUserProducts(profileId, { ...query, page: page + 1 })

    return (
        <div className='grid gap-2'>
            <nav aria-label='user products filters navigation'>
                <ul className="flex flex-wrap items-center p-1 gap-1 rounded-xl shadow-sm border dark:border-2 dark:border-zinc-600 w-fit mb-5 md:mb-0 md:ml-5" aria-label='filters list' role='filter options'>
                    {filterOptions.filter(el => !el.private || profileId === 'me').map((el, key) =>
                        <li
                            key={key}
                            className={`text-sm md:text-md rounded-lg cursor-pointer h-8 transition-all font-bold p-0.5 md:p-2 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-700 ${JSON.stringify(el.query) === JSON.stringify(query) && '!bg-slate-200 dark:!bg-zinc-600'} gap-2`}
                            onClick={() => {
                                setPage(0)
                                setQuery(el.query)
                            }}
                        >
                            {el.title}
                        </li>)}
                </ul>
            </nav>
            <ul className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-0' aria-label='list of user products'>
                {isLoading && <Spinner count={8} type='vcard' />}
                {error && error.message}
                {data?.count === 0 && <p className='md:pl-5 md:pt-3'>{t('no_results_found')}</p>}
                {data && data?.results.map((el, key) => <li>
                    <ItemCard
                        key={key}
                        product={el}
                        managable={el?.user?.id === user?.user_id}
                    />
                </li>)}
            </ul>
            {data?.pages_count > 1 && <Pagination
                className='md:ml-5 mt-5 md:mt-0 mx-auto md:mx-0'
                page={page}
                pagesCount={data?.pages_count}
                setPage={setPage}
            />}
        </div>
    )
}

export default UserProductsList