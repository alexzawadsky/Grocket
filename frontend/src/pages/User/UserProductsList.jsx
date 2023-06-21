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
import NoResponse from '../../components/Placeholders/NoResponse'
import useScreen from '../../hooks/useScreen'

const UserProductsList = () => {
    const { t } = useTranslation()

    const filterOptions = [
        {
            title: t('active'),
            query: null,
            private: false,
            grid: false,
        },
        {
            title: t('archived'),
            query: { is_archived: true },
            private: true,
            grid: false,
        },
        {
            title: t('sold'),
            query: { is_sold: true },
            private: false,
            grid: false,
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
            grid: true,
        },
    ]

    const { user } = useContext(AuthContext)
    const { isMinTablet } = useScreen()
    const [page, setPage] = useState(0)
    const [viewOption, setViewOption] = useState(filterOptions[0])
    const { profileId } = useParams()
    const { isLoading, data, error } = useUserProducts(profileId, {
        ...viewOption.query,
        page: page + 1,
    })

    return (
        <div
            className={cn(
                !isLoading && !data?.count && 'md:min-h-full',
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
                                        JSON.stringify(viewOption.query) &&
                                        '!bg-slate-200 dark:!bg-zinc-600'
                                )}
                                onClick={() => {
                                    setPage(0)
                                    setViewOption(el)
                                }}
                            >
                                {el.title}
                            </li>
                        ))}
                </ul>
            </nav>
            <ul
                className={cn(
                    'grid gap-5  md:gap-0 ',
                    isMinTablet && (profileId !== 'me' || viewOption.grid)
                        ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'max-md:grid-cols-2'
                )}
                aria-label="list of user products"
            >
                {isLoading ? (
                    <Spinner
                        count={
                            isMinTablet &&
                            (profileId !== 'me' || viewOption.grid)
                                ? 8
                                : 3
                        }
                        type={
                            isMinTablet &&
                            (profileId !== 'me' || viewOption.grid)
                                ? 'vcard'
                                : 'hcard'
                        }
                    />
                ) : error ? (
                    error?.response?.status.toString()[0] === '5' ? (
                        <NoResponse className="col-span-full mx-auto" />
                    ) : (
                        <span className="col-span-full mx-auto my-auto h-fit">
                            {error?.message}
                        </span>
                    )
                ) : data?.count ? (
                    data?.results.map((el) => (
                        <li key={el?.id}>
                            <ItemCard
                                product={el}
                                managable={el?.user?.id === user?.user_id}
                                horizontal={
                                    isMinTablet &&
                                    profileId === 'me' &&
                                    !viewOption.grid
                                }
                            />
                        </li>
                    ))
                ) : (
                    <NoResults className="max-md:py-10" />
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
