import React from 'react'
import Filters from '../components/Filters'
import ItemCard from '../components/ItemCard'
import Search from '../components/Search'

const card = {
    id: 123123,
    name: 'Apple Watch SE',
    author: {
        name: 'Timur',
        last_name: 'Ramazanov'
    },
    price: 10000,
    adress: 'Prof, 45 k1',
    pub_date: 'Yesterday, 17:00',
    img_url: 'test.png'
}

const Landing = () => {
    return (
        <div className='grid '>
            <Search />
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
                {Array(8).fill(0).map((el, key) => <ItemCard content={card} />)}
            </div>
        </div>

    )
}

export default Landing