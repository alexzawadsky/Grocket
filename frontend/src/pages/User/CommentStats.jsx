import { useTranslation } from 'react-i18next';
import { RatingStars } from '../../components';

const getAvg = (comments) => {
    if (comments.length === 0) return 0
    let total = 0
    for (const comment of comments) {
        total += comment.rate
    }
    return total / comments.length;
}

const getRateCount = (comments, rate) => {
    return comments.filter(comment => comment.rate === rate).length
}

const StatRow = ({ rate, comments }) => {

    const count = getRateCount(comments, rate)

    return (
        <div className='flex items-center gap-3'>
            <RatingStars rating={rate} />
            <div className='w-full h-2/3 border-2 border-accent-orange/[0.2] rounded-full'>
                <div style={{ width: count > 0 ? `${count / comments.length * 100}%` : '0px' }} className={`bg-accent-orange h-full rounded-full`}>
                </div>
            </div>
            <p className='text-sm text-primary-300'>{count}</p>
        </div>

    )
}

const CommentsStats = ({ comments }) => {

    const { t } = useTranslation()
    const avg = getAvg(comments)

    return (
        <div className='w-full grid gap-1 md:gap-2 lg:gap-3'>
            <div className='flex gap-5 items-center'>
                <p className='font-bold text-xl'>{avg.toFixed(2)}</p>
                <RatingStars rating={avg} />
            </div>
            <p>{t('based_on')} {comments.length} {t('based_comments')}</p>
            <div className='flex flex-col gap-1'>
                {
                    Array(5).fill(0).map((i, key) => <StatRow key={key} rate={5 - key} comments={comments} />)
                }
            </div>
        </div>
    )
}

export default CommentsStats