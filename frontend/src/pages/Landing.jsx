import React from 'react'
import Filters from '../components/Filters'
import Title from '../components/Title'
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
    img_urls: ['watch.jpeg']
}

const Landing = () => {
    return (
        <div className='grid gap-5'>
            <Search />
            <div className='flex flex-col-reverse md:flex-row gap-3 md:gap-7'>
                <div className='grid gap-5'>
                    <Title text='Goods especially for you' />
                    <div className='grid gap-5 grid-cols-2 lg:grid-cols-4 5 w-fit'>
                        {Array(8).fill(0).map((el, key) => <ItemCard key={key} content={card} />)}
                    </div>
                </div>
                <HistoryList />
            </div>
        </div>

    )
}

export default Landing