import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { HiOutlineMail } from 'react-icons/hi'
import { NavLink, Outlet } from 'react-router-dom'
import RatingStars from '../components/RatingStars'
import ProfileCard from '../components/ProfileCard'

export const userProfileLoader = ({ request, params }) => {
    return {
        id: params.userId,
        first_name: 'Alex',
        last_name: 'Zawadsky',
        email: 'alexzaw@gmail.com',
        phone: '+79001222534',
        country: 'NL',
        date_joined: '12 Jun 2022',
        avatar: '/avatar2.png',
        rating: 4.7
    }
}

const UserProfile = () => {

    const user = useLoaderData()

    return (
        <div className='flex gap-5'>
            <div className='shrink-0 grid gap-5'>
                <ProfileCard
                    firstName={user.first_name}
                    lastName={user.last_name}
                    email={user.email}
                    phone={user.phone}
                    avatar={null}
                    rating={user.rating}
                    withComments={true}
                />
                <NavLink className='font-bold text-xl' to={`/user/${user.id}`}>{user.first_name}'s lots</NavLink>
                <NavLink className='text-xl font-bold' to={`/user/${user.id}/chat`}>Messages</NavLink>
            </div>
            <div>
                <Outlet />
            </div>

        </div>
    )
}

export default UserProfile