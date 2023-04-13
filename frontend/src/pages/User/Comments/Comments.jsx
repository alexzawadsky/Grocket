import { Outlet, useOutlet, useParams, NavLink } from 'react-router-dom'
import { Spinner } from '../../../components/ui'
import CommentsStats from './CommentStats'
import Comment from './Comment'
import { useUserComments } from '../../../api/api'
import BackToProfile from '../BackToProfile'
import { useTranslation } from 'react-i18next'

const Comments = () => {

    const outlet = useOutlet()
    const { t } = useTranslation()
    const { profileId } = useParams()
    const { data, isLoading, error } = useUserComments(profileId)

    if (outlet) return <Outlet />
    if (isLoading) return <Spinner />
    if (error) return error.message

    return (
        <div className='grid gap-4'>
            <BackToProfile />
            <h1 className="text-3xl font-bold">{t('comments')}</h1>
            <div className='grid md:grid-cols-[3fr_2fr] lg:grid-cols-[2fr_1fr] gap-2 md:gap-3 lg:gap-5'>
                <CommentsStats
                    stats={data?.stats}
                    count={data?.count}
                />
                <div className='mt-auto' aria-label='how rating works'>
                    <p className='font-bold'>{t('how_rating_works')}</p>
                    <p className='text-sm'>{t('rating_is')}</p>
                    {profileId !== 'me' && <NavLink className="button-fill-orange mt-3 md:mt-7 lg:mt-11 !h-10" to='add'>{t('add_comment')}</NavLink>}
                </div>
            </div>
            <ul className="grid lg:grid-cols-2 gap-5" aria-label='list of comments'>
                {data?.results.map((el, key) => <li aria-label='comment'>
                    <Comment key={key} comment={el} />
                </li>)}
            </ul>
        </div>
    )
}

export default Comments