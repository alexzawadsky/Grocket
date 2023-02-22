import React, { useState, useEffect } from 'react'
import { Title, Search, HistoryList, ItemCard, Pagination } from '../components'
import api from '../api/api'
import { alertErr } from '../utils'

const Landing = () => {

    const [products, setProducts] = useState([])
    const [page, setPage] = useState(0)
    const [pagesCount, setPagesCount] = useState(1)

    const loadPage = () => {
        api.get(`/api/v1/products/?limit=4&page=${page + 1}`).then(res => {
            setProducts(res.data.results)
            setPagesCount(res.data.pages_count)
        }).catch(err => alertErr(err))
    }

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
            <Pagination pagesCount={pagesCount} setPage={setPage} />
        </div>

    )
}

export default Landing