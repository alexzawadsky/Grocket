import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { BsArrowLeft } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'

const MyLots = () => {

    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })

    return (
        <div className='grid gap-5 w-full'>
            {!isTablet ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
            <h1 className='font-bold text-3xl'>My lots</h1>
        </div>
    )
}

export default MyLots