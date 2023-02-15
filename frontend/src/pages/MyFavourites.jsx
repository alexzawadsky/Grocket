import React from 'react'
import { useLoaderData, NavLink } from 'react-router-dom'
import ItemCard from '../components/ItemCard'
import { useMediaQuery } from 'react-responsive'
import { BsArrowLeft } from 'react-icons/bs'

export const favouritesLoader = ({ request, params }) => {
    return [
        {
            id: 123123,
            name: 'Apple Watch Ultra',
            author: {
                id: 4545545,
                name: 'Timur',
                last_name: 'Ramazanov'
            },
            price: 1000,
            adress: 'Prof, 45 k1',
            pub_date: 'Yesterday, 17:00',
            img_urls: ['/watch.jpeg']
        },
        {
            id: 123123,
            name: 'Apple Watch Ultra',
            author: {
                id: 4545545,
                name: 'Timur',
                last_name: 'Ramazanov'
            },
            price: 1000,
            adress: 'Prof, 45 k1',
            pub_date: 'Yesterday, 17:00',
            img_urls: ['/watch.jpeg']
        },
        {
            id: 123123,
            name: 'Apple Watch Ultra',
            author: {
                id: 4545545,
                name: 'Timur',
                last_name: 'Ramazanov'
            },
            price: 1000,
            adress: 'Prof, 45 k1',
            pub_date: 'Yesterday, 17:00',
            img_urls: ['/watch.jpeg']
        },
        {
            id: 123123,
            name: 'Apple Watch Ultra',
            author: {
                id: 4545545,
                name: 'Timur',
                last_name: 'Ramazanov'
            },
            price: 1000,
            adress: 'Prof, 45 k1',
            pub_date: 'Yesterday, 17:00',
            img_urls: ['/watch.jpeg']
        }

    ]
}

const MyFavourites = () => {

    const favourites = useLoaderData()
    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })

    return (
        <div className='grid gap-5'>
            {!isTablet ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
            <h1 className="font-bold text-3xl">My favourites</h1>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-5'>
                {favourites.map((el, key) => <ItemCard content={el} />)}
            </div>
        </div>
    )
}

export default MyFavourites