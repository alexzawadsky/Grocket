import { useTranslation } from 'react-i18next'
import { RatingStars } from '../../../components/ui'

const StatRow = ({ rate, count, total }) => {
    return (
        <li
            className="flex items-center gap-3"
            aria-label={`${count} comments with rating ${rate}`}
        >
            <RatingStars rating={rate} />
            <div className="h-2/3 w-full rounded-full border-2 dark:border-zinc-600">
                <div
                    style={{
                        width: count > 0 ? `${(count / total) * 100}%` : '0px',
                    }}
                    className={`h-full rounded-full bg-accent-orange`}
                ></div>
            </div>
            <p
                className="text-sm text-primary-300 dark:text-slate-400"
                aria-label="counter"
            >
                {count}
            </p>
        </li>
    )
}

const CommentsStats = ({ count, stats }) => {
    const { t } = useTranslation()

    return (
        <section
            className="grid w-full gap-1 md:gap-2 lg:gap-3"
            aria-label="user comments statistics"
        >
            <span
                className="flex items-center gap-5 text-xl font-bold"
                aria-label="user rating"
            >
                {stats?.avg || 0}
                <RatingStars rating={stats?.avg} />
            </span>
            <p aria-label={`based on ${count} comments`}>
                {t('based_on')} {count || 0} {t('based_comments')}
            </p>
            <ul
                className="flex flex-col gap-1"
                aria-label="comments count per rating"
            >
                {Array(5)
                    .fill(0)
                    .map((i, key) => (
                        <StatRow
                            key={key}
                            rate={5 - key}
                            count={
                                Object.keys(stats || {})?.length > 0
                                    ? stats[5 - key]
                                    : 0
                            }
                            total={count}
                        />
                    ))}
            </ul>
        </section>
    )
}

export default CommentsStats
