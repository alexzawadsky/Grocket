import React, { useContext, useEffect } from 'react'
import { NavLink, Outlet, useOutlet, useLoaderData } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import ProfileCard from '../components/ProfileCard'
import AuthContext from '../contexts/AuthProvider'
import { useMediaQuery } from 'react-responsive'
import axiosApiInstance from '../hooks/useAxios'
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

export const myProfileLoader = () => {
    const api = axiosApiInstance()
    return auth
}

const MyProfile = () => {

    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })
    const { logoutUser } = useContext(AuthContext)
    const outlet = useOutlet()
    const axios = useAxios()

    useEffect(() => {
        axios.get('/api/v1/users/me/').then(res => res.json()).then(data => setUser(data)).catch(err => alert(err))
    }, [])

    return (
        <div className='flex flex-col items-center md:items-start md:flex-row gap-5'>
            {outlet && !isTablet ?
                null
                :
                (
                    <div className='shrink-0 grid gap-5'>
                        <ProfileCard
                            firstName={user?.first_name}
                            lastName={user?.last_name}
                            email={user?.email}
                            avatar={user?.avatar}
                            rating={user?.rating}
                            phone={user?.phone}
                            withComments={true}
                        />
                        <NavLink className='font-bold text-xl ' to='lots'>My lots</NavLink>
                        <NavLink className='font-bold text-xl' to='favourites'>My favourites</NavLink>
                        <button onClick={logoutUser} className='w-fit hover:bg-accent-red/[0.1] border-2 border-accent-red rounded-xl text-accent-red px-5 py-3 font-bold flex items-center gap-2'>Logout from account<FiLogOut /></button>
                    </div>
                )
            }
            <Outlet />
        </div >
    )
}

export default MyProfile