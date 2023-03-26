import { useContext } from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import { HiOutlineMail } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'
import AuthContext from '../contexts/AuthProvider'
import { Avatar, RatingStars } from './'
import useScreen from '../hooks/useScreen'
import { useTranslation } from 'react-i18next'

const ProfileCard = ({ id, firstName, lastName, email, phone, rating, avatar, withComments, commentsCount }) => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)

    return (
        <div className='flex md:flex-col md:items-start items-center gap-4 shadow-md p-5 rounded-xl shrink-0 h-fit'>
            <div className="w-full aspect-square relative">
                <Avatar avatar={avatar} />
                {user?.user_id === id ? <NavLink to='settings/avatar' className='absolute right-1 bottom-1 text-xl border-2 border-accent-orange text-accent-orange p-2 rounded-full bg-white'><BiPencil /></NavLink> : null}
            </div>
            <div className="grid gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                    {firstName ? <p className='lg:text-xl'>{firstName}</p> : <p className='text-primary-100 text-xl'>{t('first_name')}</p>}
                    {lastName ? <p className='lg:text-xl'>{lastName}</p> : <p className='text-primary-100 text-xl'>{t('last_name')}</p>}
                </div>
                {phone && <p className='text-sm md:text-md flex items-center gap-2'><BsFillTelephoneFill />{phone}</p>}
                <p className={email ? 'text-sm md:text-md flex items-center gap-2' : 'flex items-center gap-2 text-primary-100'}><HiOutlineMail width={1.5} />{email ? email : 'email@email.com'}</p>
                <div className='flex flex-wrap gap-1 md:gap-3'>
                    <RatingStars rating={rating} />
                    {withComments ? <NavLink className='text-accent-orange underline' to='comments'>{t('comments')} ({commentsCount})</NavLink> : null}
                </div>
            </div>
        </div>
    )
}

export default ProfileCard