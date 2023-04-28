import { useContext } from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import { HiOutlineMail } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import AuthContext from '../../contexts/AuthProvider'
import { Avatar, RatingStars, Flag } from '../ui'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

const ProfileCard = ({
    id,
    firstName,
    lastName,
    email,
    phone,
    rating,
    avatar,
    withComments,
    commentsCount,
    country,
}) => {
    const { t } = useTranslation()
    const { user } = useContext(AuthContext)

    return (
        <aside
            className="grid h-fit shrink-0 grid-cols-2 items-center gap-5 rounded-xl border p-5 shadow-md dark:border-2 dark:border-zinc-600 md:grid-cols-1 md:items-start"
            aria-label="user profile card"
        >
            <div className="relative aspect-square w-full" aria-label="avatar">
                <Avatar
                    avatar={avatar}
                    alt={`${firstName} ${lastName} avatar image`}
                />
                {user?.user_id === id && (
                    <Link
                        to="settings"
                        className="absolute bottom-1 right-1 rounded-full border-2 bg-white p-2 text-xl hover:bg-slate-100 dark:border-zinc-600 dark:bg-zinc-800 hover:dark:bg-zinc-700"
                        aria-label="edit profile button"
                    >
                        <BiPencil />
                    </Link>
                )}
            </div>
            <div className="grid gap-2 md:gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="flex flex-wrap items-center gap-x-2 font-bold leading-none lg:text-xl">
                        <Flag country={country} className="h-fit w-5 pb-0.5" />
                        <span
                            className={!firstName && 'text-zinc-400'}
                            aria-label="first name"
                        >
                            {firstName ? firstName : t('first_name')}
                        </span>
                        <span
                            className={!lastName && 'text-zinc-400'}
                            aria-label="last name"
                        >
                            {lastName ? lastName : t('last_name')}
                        </span>
                    </p>
                    {/* {firstName ? <p className='lg:text-xl font-bold'>{firstName}</p> : <p className='text-primary-100 text-xl'>{t('first_name')}</p>}
                    {lastName ? <p className='lg:text-xl font-bold'>{lastName}</p> : <p className='text-primary-100 text-xl'>{t('last_name')}</p>} */}
                </div>
                {phone && (
                    <p
                        className="md:text-md flex items-center gap-2 text-sm"
                        aria-label="phone number"
                    >
                        <BsFillTelephoneFill />
                        {phone}
                    </p>
                )}
                <p
                    className={
                        email
                            ? 'md:text-md flex items-center gap-2 text-sm'
                            : 'md:text-md flex items-center gap-2 text-sm text-zinc-400'
                    }
                    aria-label="email"
                >
                    <HiOutlineMail width={1.5} />
                    {email ? email : 'email@email.com'}
                </p>
                <div className="flex flex-wrap items-center gap-1 md:gap-3">
                    <RatingStars rating={rating} />
                    {withComments && (
                        <Link
                            className="text-sm hover:text-accent-orange"
                            to="comments"
                            aria-label="link to comments"
                        >
                            {t('comments')} ({commentsCount})
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    )
}

export default ProfileCard
