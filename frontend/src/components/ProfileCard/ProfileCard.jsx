import { useContext } from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import { HiOutlineMail } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'
import AuthContext from '../../contexts/AuthProvider'
import { Avatar, RatingStars, Flag } from '../ui'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

const ProfileCard = ({ id, firstName, lastName, email, phone, rating, avatar, withComments, commentsCount, country }) => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)

    return (
        <aside className='grid-cols-2 md:grid-cols-1 grid md:items-start items-center gap-5 shadow-md p-5 rounded-xl shrink-0 h-fit border dark:border-2 dark:border-zinc-600' aria-label='user profile card'>
            <div className="w-full aspect-square relative" aria-label='avatar'>
                <Avatar avatar={avatar} alt={`${firstName} ${lastName} avatar image`} />
                {user?.user_id === id &&
                    <NavLink
                        to='settings'
                        className='absolute right-1 bottom-1 text-xl border-2 dark:border-zinc-600 p-2 rounded-full bg-white dark:bg-zinc-800 hover:dark:bg-zinc-700 hover:bg-slate-100'
                        aria-label='edit profile button'
                    >
                        <BiPencil />
                    </NavLink>}
            </div>
            <div className="grid gap-2 md:gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className='lg:text-xl font-bold flex items-center flex-wrap gap-2'>
                        <Flag country={country} className='h-fit w-5 pb-0.5' />
                        <span className={!firstName && 'text-zinc-600'} aria-label='first name'>
                            {firstName ? firstName : t('first_name')}
                        </span>
                        <span className={!lastName && 'text-zinc-600'} aria-label='last name'>
                            {lastName ? lastName : t('last_name')}
                        </span>
                    </p>
                    {/* {firstName ? <p className='lg:text-xl font-bold'>{firstName}</p> : <p className='text-primary-100 text-xl'>{t('first_name')}</p>}
                    {lastName ? <p className='lg:text-xl font-bold'>{lastName}</p> : <p className='text-primary-100 text-xl'>{t('last_name')}</p>} */}
                </div>
                {phone && <p className='text-sm md:text-md flex items-center gap-2' aria-label='phone number'>
                    <BsFillTelephoneFill />{phone}
                </p>}
                <p className={email ? 'text-sm md:text-md flex items-center gap-2' : 'text-sm md:text-md flex items-center gap-2 text-zinc-600'} aria-label='email'>
                    <HiOutlineMail width={1.5} />{email ? email : 'email@email.com'}
                </p>
                <div className='flex flex-wrap gap-1 md:gap-3 items-center'>
                    <RatingStars rating={rating} />
                    {withComments && <NavLink
                        className='hover:text-accent-orange text-sm'
                        to='comments'
                        aria-label='link to comments'
                    >
                        {t('comments')} ({commentsCount})
                    </NavLink>}
                </div>
            </div>
        </aside>
    )
}

export default ProfileCard