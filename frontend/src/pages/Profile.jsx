import React from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { HiOutlineMail } from 'react-icons/hi'
import { NavLink, Outlet } from 'react-router-dom'
import RatingStars from '../components/RatingStars'
import Flag from 'react-flags'

const auth = {
    id: 1121212,
    name: 'Timur',
    last_name: 'Ramazanov',
    email: 'timurram007@gmail.com',
    phone_number: '+79001231212',
    country: 'RUS',
    date_joined: '21 Feb 2023',
    avatar_url: '/avatar.jpg',
    rating: 3.7
}


const MyProfile = () => {
    return (
        <div className='flex gap-5'>
            <div className='shrink-0'>
                <div className='grid gap-4 border-2 border-black p-5 rounded-xl shrink-0 h-fit'>
                    <img className='w-72 object-cover rounded-full' src={auth.avatar_url} alt="" />
                    <div className="flex items-center justify-between">
                        <p className='text-xl'>{auth.last_name} {auth.name}</p>
                        <Flag name={auth.country} format='png' pngSize={64} shiny={true} />
                    </div>
                    <p className='flex items-center gap-3'><BsFillTelephoneFill />{auth.phone_number}</p>
                    <p className='flex gap-3 items-center'><HiOutlineMail width={1.5} />{auth.email}</p>
                    <div className='flex gap-3'>
                        <RatingStars rating={auth.rating} />
                        <NavLink className='text-accent-orange underline' to='comments'>Comments</NavLink>
                    </div>
                </div>
                <nav className='mt-5'>
                    <NavLink className='font-bold text-xl' to='lots'>My lots</NavLink>
                </nav>
            </div>

            <div>
                <Outlet />
            </div>

        </div>
    )
}

export default MyProfile