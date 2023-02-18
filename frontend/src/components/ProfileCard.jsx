import React, { useContext, useEffect } from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { BiPencil } from 'react-icons/bi'
import { HiOutlineMail } from 'react-icons/hi'
import { NavLink } from 'react-router-dom'
import AuthContext from '../contexts/AuthProvider'
import { Avatar, RatingStars } from './'

const ProfileCard = ({ id, firstName, lastName, email, phone, rating, avatar, withComments }) => {

    const { user } = useContext(AuthContext)
    return (
        <div className='grid gap-4 border-2 border-black p-5 rounded-xl shrink-0 h-fit w-fit'>
            <div className="w-full max-w-[18rem] aspect-square relative">
                <Avatar avatar={avatar} />
                {user.user_id === id ? <NavLink to='settings/avatar' className='absolute right-1 bottom-1 text-xl border-2 border-accent-orange text-accent-orange p-2 rounded-full'><BiPencil /></NavLink> : null}
            </div>
            <div className="flex items-center gap-2">
                {firstName ? <p className='text-xl'>{firstName}</p> : <p className='text-primary-100 text-xl'>Name</p>}
                {lastName ? <p className='text-xl'>{lastName}</p> : <p className='text-primary-100 text-xl'>Last name</p>}
            </div>
            <p className='flex items-center gap-3'><BsFillTelephoneFill />
                {phone ? <p>{phone}</p> : <p className='text-primary-100'>+XXXXXXXXXXX</p>}
            </p>
            <p className='flex gap-3 items-center'><HiOutlineMail width={1.5} />
                {email ? <p>{email}</p> : <p className='text-primary-100'>email@email.com</p>}
            </p>
            <div className='flex gap-3'>
                <RatingStars rating={rating} />
                <p>{rating ? rating.toFixed(2) : '0.00'}</p>
                {withComments ? <NavLink className='text-accent-orange underline' to='comments'>Comments</NavLink> : null}
            </div>
        </div>
    )
}

export default ProfileCard