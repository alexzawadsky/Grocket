import React from 'react'
import { useLoaderData } from 'react-router-dom'
import ItemCard from '../components/ItemCard'

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
            img_url: '/watch.jpeg'
        }
    ]
}

const MyFavourites = () => {

    const favourites = useLoaderData()

    return (
        <div>
            <h1 className="font-bold text-3xl pb-5">My favourites</h1>
            <div className='grid grid-cols-4 gap-5'>
                {favourites.map((el, key) => <ItemCard content={el} />)}
            </div>
        </div>
    )
}

export default MyFavourites