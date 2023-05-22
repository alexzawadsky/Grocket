import { Outlet, useOutlet, useParams, NavLink } from 'react-router-dom'
import { Button, Pagination, Spinner } from '../../../components/ui'
import CommentsStats from './CommentStats'
import Comment from './Comment'
import { useUserComments } from '../../../api/api'
import BackToProfile from '../BackToProfile'
import { useTranslation } from 'react-i18next'
import { useContext, useState } from 'react'
import AuthContext from '../../../contexts/AuthProvider'
import NoResponse from '../../../components/Placeholders/NoResponse'

const Comments = () => {
    const outlet = useOutlet()
    const { t } = useTranslation()
    const { profileId } = useParams()
    const [page, setPage] = useState(0)
    const { data, isLoading, error } = useUserComments(profileId, page + 1)
    const { user } = useContext(AuthContext)

    if (outlet) return <Outlet />

    return (
        <div className="grid gap-4">
            <BackToProfile />
            <h1 className="text-3xl font-bold">{t('comments')}</h1>
            <div className="grid gap-2 md:grid-cols-[3fr_2fr] md:gap-3 lg:grid-cols-[2fr_1fr] lg:gap-5">
                <CommentsStats stats={data?.stats} count={data?.count} />
                <div className="mt-auto" aria-label="how rating works">
                    <p className="font-bold">{t('how_rating_works')}</p>
                    <p className="text-sm">{t('rating_is')}</p>
                    {profileId !== 'me' &&
                        user &&
                        user?.user_id != profileId && (
                            <Button
                                px={5}
                                height={10}
                                width="fit"
                                style="fill"
                                color="accent-orange"
                                to="add"
                                className="mt-3 md:mt-7 lg:mt-11"
                                border={false}
                                bold
                            >
                                {t('add_comment')}
                            </Button>
                        )}
                </div>
            </div>
            <ul
                className="grid gap-5 lg:grid-cols-2"
                aria-label="list of comments"
            >
                {isLoading ? (
                    <Spinner type="comment" count={2} />
                ) : error ? (
                    error.response.status.toString()[0] === '5' ? (
                        <NoResponse />
                    ) : (
                        error.message
                    )
                ) : (
                    data?.results.map((el, key) => (
                        <li key={key} aria-label="comment">
                            <Comment comment={el} />
                        </li>
                    ))
                )}
            </ul>
            {data?.pages_count > 1 && (
                <Pagination
                    className="mt-1 max-md:mx-auto"
                    page={page}
                    setPage={setPage}
                    pagesCount={data?.pages_count}
                />
            )}
        </div>
    )
}

export default Comments
