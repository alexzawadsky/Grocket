import { useParams } from 'react-router-dom'
import { Spinner } from '../../components'
import CommentsStats from './CommentStats'
import Comment from './Comment'
import { useUserComments } from '../../api/api'
import BackToProfile from './BackToProfile'
import { useTranslation } from 'react-i18next'

const Comments = () => {

    const { t } = useTranslation()
    const { profileId } = useParams()
    const { data, isLoading, error } = useUserComments(profileId)

    if (isLoading) return <Spinner />
    if (error) return error.message

    return (
        <div className='grid gap-4'>
            <BackToProfile />
            <h1 className="text-3xl font-bold">{t('comments')}</h1>
            <div className='grid md:grid-cols-[3fr_2fr] lg:grid-cols-[2fr_1fr] gap-2 md:gap-3 lg:gap-5'>
                <CommentsStats comments={data} />
                <div className='mt-auto'>
                    <p className='font-bold'>{t('how_rating_works')}</p>
                    <p className='text-sm'>{t('rating_is')}</p>
                    <button className="button-fill-orange mt-3 md:mt-7 lg:mt-11">{t('add_comment')}</button>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-5">
                {data.map((el, key) => <Comment key={key} comment={el} />)}
            </div>
        </div>
    )
}

export default Comments