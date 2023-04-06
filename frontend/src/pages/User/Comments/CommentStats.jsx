import { useTranslation } from 'react-i18next';
import { RatingStars } from '../../../components/ui';

const StatRow = ({ rate, count, total }) => {
    return (
        <div className='flex items-center gap-3'>
            <RatingStars rating={rate} />
            <div className='w-full h-2/3 border-2 border-accent-orange/[0.2] rounded-full'>
                <div style={{ width: count > 0 ? `${count / total * 100}%` : '0px' }} className={`bg-accent-orange h-full rounded-full`}>
                </div>
            </div>
            <p className='text-sm text-primary-300'>{count}</p>
        </div>

    )
}

const CommentsStats = ({ count, stats }) => {

    const { t } = useTranslation()

    return (
        <div className='w-full grid gap-1 md:gap-2 lg:gap-3'>
            <div className='flex gap-5 items-center'>
                <p className='font-bold text-xl'>{stats?.avg}</p>
                <RatingStars rating={stats?.avg} />
            </div>
            <p>{t('based_on')} {count} {t('based_comments')}</p>
            <div className='flex flex-col gap-1'>
                {
                    Array(5).fill(0).map((i, key) =>
                        <StatRow key={key}
                            rate={5 - key}
                            count={stats[5 - key]}
                            total={count}
                        />)
                }
            </div>
        </div>
    )
}

export default CommentsStats