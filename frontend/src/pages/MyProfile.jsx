import React, { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import ProfileCard from '../components/ProfileCard'
import AuthContext from '../contexts/AuthProvider'
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

    const { logoutUser } = useContext(AuthContext)

    return (
        <div className='flex gap-5'>
            <div className='shrink-0 grid gap-5'>
                <ProfileCard
                    firstName={auth.first_name}
                    lastName={auth.last_name}
                    email={auth.email}
                    avatar={auth.avatar}
                    rating={auth.rating}
                    phone={auth.phone}
                    withComments={true}
                />
                <nav className='flex flex-col gap-3 pl-10'>
                    <NavLink className='font-bold text-xl list-item' to='lots'>My lots</NavLink>
                    <NavLink className='font-bold text-xl list-item' to='favourites'>My favourites</NavLink>
                </nav>
                <button onClick={logoutUser} className='w-fit hover:bg-accent-red/[0.1] border-2 border-accent-red rounded-xl text-accent-red px-5 py-3 font-bold flex items-center gap-2'>Logout from account<FiLogOut /></button>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default MyProfile