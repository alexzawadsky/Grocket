import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { NavLink, Outlet, useOutlet } from 'react-router-dom'
import { ProfileCard } from '../components/'
import { useMediaQuery } from 'react-responsive'
import api from '../api/api'
import { alertErr } from '../utils'

const UserProfile = () => {

    const { userId } = useParams()
    const [user, setUser] = useState()
    const outlet = useOutlet()
    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })

    useEffect(_ => {
        api.get(`/api/v1/users/${userId}`).then(res => setUser(res.data)).catch(err => alertErr(err))
    }, [])

    return (
        <>
            {user ? <div className='flex flex-col items-center md:items-start md:flex-row gap-5'>
                {outlet && !isTablet ?
                    null
                    :
                    (
                        <div className='shring-0 grid gap-5'>
                            <ProfileCard
                                firstName={user.first_name}
                                lastName={user.last_name}
                                email={user.email}
                                phone={user.phone}
                                avatar={user.avatar}
                                rating={user.rating}
                                withComments={true}
                            />
                            <NavLink className='font-bold text-xl' to='lots'>{user.first_name}'s lots</NavLink>
                            <NavLink className='text-xl font-bold' to='chat'>Messages</NavLink>
                        </div>
                    )
                }
                <Outlet />
            </div> : null}
        </>
    )
}

export default UserProfile