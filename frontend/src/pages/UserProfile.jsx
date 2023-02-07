import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { HiOutlineMail } from 'react-icons/hi'
import { NavLink, Outlet } from 'react-router-dom'
import RatingStars from '../components/RatingStars'

export const userProfileLoader = ({ request, params }) => {
    return {
        id: params.userId,
        name: 'Alex',
        last_name: 'Zawadsky',
        email: 'alexzaw@gmail.com',
        phone_number: '+79001222534',
        country: 'NL',
        date_joined: '12 Jun 2022',
        avatar_url: '/avatar2.png',
        rating: 4.7
    }
}

const UserProfile = () => {

    const user = useLoaderData()

    return (
        <div className='flex gap-5'>
            <div className='shrink-0 grid gap-5'>
                <div className='grid gap-4 border-2 border-black p-5 rounded-xl shrink-0 h-fit'>
                    <img className='w-72 object-cover rounded-full h-72' src={user.avatar_url} alt="" />
                    <p className='text-xl'>{user.last_name} {user.name}</p>
                    <p className='flex items-center gap-3'><BsFillTelephoneFill />{user.phone_number}</p>
                    <p className='flex gap-3 items-center'><HiOutlineMail width={1.5} />{user.email}</p>
                    <div className='flex gap-3'>
                        <RatingStars rating={user.rating} />
                        <NavLink className='text-accent-orange underline' to='comments'>Comments</NavLink>
                    </div>
                </div>
                <NavLink className='font-bold text-xl' to={`/user/${user.id}`}>{user.name}'s lots</NavLink>
                <NavLink className='text-xl font-bold' to={`/uset/${user.id}/chat`}>Messages</NavLink>
            </div>
            <div>
                <Outlet />
            </div>

        </div>
    )
}

export default UserProfile