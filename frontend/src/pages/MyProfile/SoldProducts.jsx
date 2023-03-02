import React, { useEffect, useState } from 'react'
import useAxios from '../../hooks/useAxios'
import { useMediaQuery } from 'react-responsive'
import { NavLink } from 'react-router-dom'
import { Pagination } from '../../components'
import MyLot from './MyLot'
import { BsArrowLeft } from 'react-icons/bs'
import MyProductsList from './MyProductsList'

const Sold = () => {

    const isPhone = useMediaQuery({ query: '(max-width: 764px)' })

    return (
        <div className='grid gap-5 w-full'>
            {isPhone ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
            <h1 className='font-bold text-3xl'>Sold items</h1>
            <MyProductsList query={{ is_sold: true }} />
        </div>
    )
}

export default Sold