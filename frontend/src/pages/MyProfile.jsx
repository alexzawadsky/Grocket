import React from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { HiOutlineMail } from 'react-icons/hi'
import { NavLink, Outlet } from 'react-router-dom'
import RatingStars from '../components/RatingStars'
import ProfileCard from '../components/ProfileCard'
// import Flag from 'react-flags'

const auth = {
    id: 1121212,
    first_name: 'Timur',
    last_name: 'Ramazanov',
    email: 'timurram007@gmail.com',
    phone: '+79001231212',
    country: 'RUS',
    date_joined: '21 Feb 2023',
    avatar: '/avatar.jpg',
    rating: 3.29
}


const MyProfile = () => {
    return (
        <div className='flex gap-5'>
            <div className='shrink-0'>
                <ProfileCard
                    firstName={auth.first_name}
                    lastName={auth.last_name}
                    email={auth.email}
                    avatar={auth.avatar}
                    rating={auth.rating}
                    phone={auth.phone}
                    withComments={true}
                />
                <nav className='mt-5 flex flex-col gap-3 pl-10'>
                    <NavLink className='font-bold text-xl list-item' to='lots'>My lots</NavLink>
                    <NavLink className='font-bold text-xl list-item' to='favourites'>My favourites</NavLink>
                </nav>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default MyProfile