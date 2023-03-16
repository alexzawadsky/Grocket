import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { PublishTime, RatingStars } from '../../components'
import AuthContext from '../../contexts/AuthProvider'

const Comment = ({ comment }) => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)

    return (
        <div className='border-2 border-black rounded-lg p-5 grid gap-1 h-fit'>
            <p className='font-bold text-lg'>{comment?.user?.first_name} {comment?.user?.last_name}</p>
            {/* <p className='text-primary-300/[0.8] text-sm'>Posted on </p> */}
            <p className='text-sm text-primary-300'><strong>{t('status')}:</strong> {t(comment?.status)}</p>
            <p className='text-primary-300/[0.8] text-sm font-bold'>
                {comment?.product?.name} - <PublishTime pubDate={comment?.pub_date} /></p>
            <p>{comment?.text}</p>
            <RatingStars rating={comment?.rating} />
        </div>
    )
}

export default Comment