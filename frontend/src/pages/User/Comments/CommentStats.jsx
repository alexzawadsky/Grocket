import { useTranslation } from 'react-i18next';
import { RatingStars } from '../../../components/ui';

const StatRow = ({ rate, count, total }) => {
    return (
        <li className='flex items-center gap-3' aria-label={`${count} comments with rating ${rate}`}>
            <RatingStars rating={rate} />
            <div className='w-full h-2/3 border-2 border-accent-orange/[0.2] rounded-full'>
                <div style={{ width: count > 0 ? `${count / total * 100}%` : '0px' }} className={`bg-accent-orange h-full rounded-full`}>
                </div>
            </div>
            <p className='text-sm text-primary-300 dark:text-slate-400' aria-label='counter'>{count}</p>
        </li>
    )
}

const CommentsStats = ({ count, stats }) => {

    const { t } = useTranslation()

    return (
        <section className='w-full grid gap-1 md:gap-2 lg:gap-3' aria-label='user comments statistics'>
            <span className='flex gap-5 items-center font-bold text-xl' aria-label='user rating'>
                {stats?.avg}
                <RatingStars rating={stats?.avg} />
            </span>
            <p aria-label={`based on ${count} comments`}>{t('based_on')} {count} {t('based_comments')}</p>
            <ul className='flex flex-col gap-1' aria-label='comments count per rating'>
                {Array(5).fill(0).map((i, key) =>
                    <StatRow key={key}
                        rate={5 - key}
                        count={stats[5 - key]}
                        total={count}
                    />)}
            </ul>
        </section>
    )
}

export default CommentsStats