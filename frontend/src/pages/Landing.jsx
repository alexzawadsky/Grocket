import React, { useState, useEffect } from 'react'
import { Title, Search, HistoryList, ItemCard } from '../components'
import api from '../api/api'
import ReactPaginate from 'react-paginate'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { useMediaQuery } from 'react-responsive'

const card = {
    id: 123123,
    name: 'Apple Watch Ultraaaaaa aaaaaaaaaaaa aaaaaaaaa aaaaaaa aaaaa',
    author: {
        id: 4545545,
        name: 'Timur',
        last_name: 'Ramazanov'
    },
    price: 1000,
    price_currency: "RUB",
    address: 'Moscow, Profsoyuznaya 45555555555555555555555',
    pub_date: 'Yesterday, 17:00',
    images: ['1.jpg'],
    category: {
        id: 1,
        title: 'Smart watches'
    }
}

const Landing = () => {

    const [products, setProducts] = useState([])
    const [page, setPage] = useState(0)
    const [pagesCount, setPagesCount] = useState(1)

    const isPhone = useMediaQuery({ query: '(max-width: 639px)' })

    const loadPage = () => {
        api.get(`/api/v1/products/?limit=4&page=${page + 1}`).then(res => {
            setProducts(res.data.results)
            setPagesCount(res.data.pages_count)
        }).catch(err => alert(`${err.response.status} ${err.response.message}`))
    }

    useEffect(_ => {
        loadPage()
    }, [])

    useEffect(_ => {
        loadPage()
    }, [page])

    return (
        <div className='flex flex-col gap-5 items-center md:items-start'>
            <Search />
            <div className='md:grid md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] flex flex-col-reverse gap-3 md:gap-7 w-full'>
                <div className='grid gap-5 w-full h-fit'>
                    <Title text='Goods especially for you' />
                    <div className='grid gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {products ? products.map((el, key) => <ItemCard key={key} product={el} />) : null}
                    </div>
                </div>
                <HistoryList />
            </div>
            <ReactPaginate
                pageCount={pagesCount}
                pageRangeDisplayed={isPhone ? 1 : 3}
                marginPagesDisplayed={isPhone ? 1 : 3}
                onPageChange={(page) => setPage(page.selected)}
                className='flex gap-5'
                activeClassName='font-bold'
                pageClassName='hover:text-accent-orange'
                previousClassName='text-accent-orange font-bold'
                nextClassName='text-accent-orange font-bold'
                previousLabel={<p className='flex items-center gap-2'><BsArrowLeft />Previous</p>}
                nextLabel={<p className='flex items-center gap-2'>Next<BsArrowRight /></p>}
            />
        </div>

    )
}

export default Landing