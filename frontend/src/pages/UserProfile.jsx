import React, { useEffect, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import { NavLink, Outlet, useOutlet } from 'react-router-dom'
import { ProfileCard } from '../components/'
import { useMediaQuery } from 'react-responsive'
import useAxios from '../hooks/useAxios'

const userMock = {
    id: 111,
    first_name: 'Alex',
    last_name: 'Zawadsky',
    email: 'alexzaw@gmail.com',
    phone: '+79001222534',
    country: 'NL',
    date_joined: '12 Jun 2022',
    avatar: '/avatar2.png',
    rating: 4.7
}

const UserProfile = () => {

    const { userId } = useParams()
    const [user, setUser] = useState()
    const outlet = useOutlet()
    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })
    const api = useAxios()

    useEffect(_ => {
        api.get(`/api/v1/users/${userId}`).then(res => setUser(res.data)).catch(err => alert(err.response.status))
        setUser(userMock)
    }, [])

    return (
        <>
            {user ? <div className='flex flex-col items-center md:items-start md:flex-row gap-5'>
                {outlet && !isTablet ?
                    null :
                    (
                        <div className='grow grid gap-5 w-fit'>
                            <ProfileCard
                                firstName={user.first_name}
                                lastName={user.last_name}
                                email={user.email}
                                phone={user.phone}
                                avatar={null}
                                rating={user.rating}
                                withComments={true}
                            />
                            <NavLink className='font-bold text-xl' to='lots'>{user.first_name}'s lots</NavLink>
                            <NavLink className='text-xl font-bold' to='chat'>Messages</NavLink>
                        </div>
                    )}
                <div className='w-full'>
                    <Outlet />
                </div>
            </div> : null}
        </>

    )
}

export default UserProfile