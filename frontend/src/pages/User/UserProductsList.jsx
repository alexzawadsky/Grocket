import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserProducts } from '../../api/api'
import { ItemCard } from '../../components'
import { Spinner, Pagination } from '../../components/ui'
import { useTranslation } from 'react-i18next'
import AuthContext from '../../contexts/AuthProvider'
import { AiFillHeart } from 'react-icons/ai'
import cn from 'classnames'
import NoResults from '../../components/Placeholders/NoResults'

const UserProductsList = () => {
    const { t } = useTranslation()

    const filterOptions = [
        {
            title: t('active'),
            query: null,
            private: false,
        },
        {
            title: t('archived'),
            query: { is_archived: true },
            private: true,
        },
        {
            title: t('sold'),
            query: { is_sold: true },
            private: false,
        },
        {
            title: (
                <>
                    <AiFillHeart color={'red'} />
                    {t('favourites')}
                </>
            ),
            query: { is_favourited: true },
            private: true,
        },
    ]

    const { user } = useContext(AuthContext)
    const [page, setPage] = useState(0)
    const { profileId } = useParams()
    const [query, setQuery] = useState(null)
    const { isLoading, data, error } = useUserProducts(profileId, {
        ...query,
        page: page + 1,
    })

    return (
        <div
            className={cn(
                !isLoading && !data?.count && 'min-h-full',
                'grid grid-rows-[auto_1fr] gap-2'
            )}
        >
            <nav
                aria-label="user products filters navigation"
                className="h-fit"
            >
                <ul
                    className="mb-5 flex w-fit flex-wrap items-center gap-1 rounded-xl border p-1 shadow-sm dark:border-2 dark:border-zinc-600 md:mb-0 md:ml-5"
                    aria-label="filters list"
                    role="filter options"
                >
                    {filterOptions
                        .filter((el) => !el.private || profileId === 'me')
                        .map((el, key) => (
                            <li
                                key={key}
                                className={cn(
                                    'md:text-md flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg p-2 text-sm font-bold transition-all hover:bg-slate-100 dark:hover:bg-zinc-700',
                                    JSON.stringify(el.query) ===
                                        JSON.stringify(query) &&
                                        '!bg-slate-200 dark:!bg-zinc-600'
                                )}
                                onClick={() => {
                                    setPage(0)
                                    setQuery(el.query)
                                }}
                            >
                                {el.title}
                            </li>
                        ))}
                </ul>
            </nav>
            <ul
                className="grid grid-cols-2 gap-5 md:gap-0 lg:grid-cols-3 xl:grid-cols-4"
                aria-label="list of user products"
            >
                {isLoading && <Spinner count={8} type="vcard" />}
                {error && error.message}
                {data?.count ? (
                    !isLoading &&
                    data &&
                    data?.results.map((el) => (
                        <li key={el?.id}>
                            <ItemCard
                                product={el}
                                managable={el?.user?.id === user?.user_id}
                            />
                        </li>
                    ))
                ) : (
                    <NoResults className="max-md:py-7 md:pl-5" />
                )}
            </ul>
            {data?.pages_count > 1 && (
                <Pagination
                    className="mx-auto mt-5 md:mx-0 md:ml-5 md:mt-0"
                    page={page}
                    pagesCount={data?.pages_count}
                    setPage={setPage}
                />
            )}
        </div>
    )
}

export default UserProductsList
