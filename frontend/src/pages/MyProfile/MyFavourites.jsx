import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ItemCard, Pagination, ProductsList, Spinner, Title } from '../../components'
import { useMediaQuery } from 'react-responsive'
import { BsArrowLeft } from 'react-icons/bs'
import { AiFillHeart } from 'react-icons/ai'
import { useProducts } from '../../api/api'

const MyFavourites = () => {

    const isPhone = useMediaQuery({ query: '(max-width: 639px)' })

    return (
        <div className='grid gap-5 w-full'>
            {isPhone ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
            <div className='flex items-center gap-2'><p className='text-accent-red text-3xl'><AiFillHeart /></p><Title text='Favourites' /></div>
            <ProductsList query={{ is_favourited: true }} />
        </div>
    )
}

export default MyFavourites