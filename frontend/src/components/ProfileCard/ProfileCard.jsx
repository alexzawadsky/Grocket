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
        <div className='grid-cols-2 md:grid-cols-1 grid md:items-start items-center gap-5 shadow-md p-5 rounded-xl shrink-0 h-fit border'>
            <div className="w-full aspect-square relative">
                <Avatar avatar={avatar} />
                {user?.user_id === id ? <NavLink to='settings' className='absolute right-1 bottom-1 text-xl border-2  p-2 rounded-full bg-white'><BiPencil /></NavLink> : null}
            </div>
            <div className="grid gap-2 md:gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className='lg:text-xl font-bold flex items-center flex-wrap gap-2'>
                        {country && <span className='h-fit w-5 pb-0.5'>
                            <Flag country={country} />
                        </span>}
                        <span className={!firstName && 'text-primary-100'}>
                            {firstName ? firstName : t('first_name')}
                        </span>
                        <span className={!lastName && 'text-accent-100'}>
                            {lastName ? lastName : t('last_name')}
                        </span>
                    </p>
                    {/* {firstName ? <p className='lg:text-xl font-bold'>{firstName}</p> : <p className='text-primary-100 text-xl'>{t('first_name')}</p>}
                    {lastName ? <p className='lg:text-xl font-bold'>{lastName}</p> : <p className='text-primary-100 text-xl'>{t('last_name')}</p>} */}
                </div>
                {phone && <p className='text-sm md:text-md flex items-center gap-2'><BsFillTelephoneFill />{phone}</p>}
                <p className={email ? 'text-sm md:text-md flex items-center gap-2' : 'text-sm md:text-md flex items-center gap-2 text-primary-100'}><HiOutlineMail width={1.5} />{email ? email : 'email@email.com'}</p>
                <div className='flex flex-wrap gap-1 md:gap-3 items-center'>
                    <RatingStars rating={rating} />
                    {withComments ? <NavLink className='hover:text-accent-orange text-sm' to='comments'>{t('comments')} ({commentsCount})</NavLink> : null}
                </div>
            </div>
        </div>
    )
}

export default ProfileCard