import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { NavLink, Outlet, useOutlet } from 'react-router-dom'
import { ProfileCard, Spinner } from '../../components'
import { useMediaQuery } from 'react-responsive'
import api, { useProfile } from '../../api/api'
import { alertErr } from '../../utils'

const UserProfile = () => {

    const { userId } = useParams()
    const outlet = useOutlet()
    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })

    const { data, isLoading, error } = useProfile(userId)

    if (isLoading) return <Spinner />
    if (error) return error.message

    return (
        <div className='flex flex-col items-center md:items-start md:flex-row gap-5'>
            {outlet && !isTablet ?
                null
                :
                (
                    <div className='shring-0 grid gap-5'>
                        <ProfileCard
                            id={data.id}
                            firstName={data.first_name}
                            lastName={data.last_name}
                            email={data.email}
                            phone={data.phone}
                            avatar={data.avatar}
                            rating={data.rating}
                            withComments={true}
                        />
                        <NavLink className='font-bold text-xl' to='lots'>{data.first_name}'s lots</NavLink>
                        <NavLink className='text-xl font-bold' to='chat'>Messages</NavLink>
                    </div>
                )
            }
            <Outlet />
        </div>
    )
}

export default UserProfile