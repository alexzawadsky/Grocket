import React from 'react'
import Filters from '../components/Filters'
import HistoryList from '../components/HistoryList'
import ItemCard from '../components/ItemCard'
import Search from '../components/Search'

const card = {
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
    img_url: 'watch.jpeg'
}

const Landing = () => {
    return (
        <div className='grid gap-5'>
            <Search />
            <div className='flex gap-7'>
                <div>
                    <h1 className='pb-5 font-bold text-2xl'>Goods especially for you</h1>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                        {Array(8).fill(0).map((el, key) => <ItemCard key={key} content={card} />)}
                    </div>
                </div>
                <div>
                    <HistoryList />
                </div>
            </div>
        </div>

    )
}

export default Landing