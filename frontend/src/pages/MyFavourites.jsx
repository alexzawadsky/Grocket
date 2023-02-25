import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { ItemCard, Pagination, Title } from '../components'
import { useMediaQuery } from 'react-responsive'
import { BsArrowLeft } from 'react-icons/bs'
import useAxios from '../hooks/useAxios'
import { AiFillHeart } from 'react-icons/ai'


const data = [
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

const MyFavourites = () => {

    const [products, setProducts] = useState()
    const [page, setPage] = useState(0)
    const [pagesCount, setPagesCount] = useState(1)
    const isPhone = useMediaQuery({ query: '(max-width: 639px)' })
    const api = useAxios()

    const loadPage = () => {
        api.get(`/api/v1/products/?limit=4&page=${page + 1}&is_favourited=1`).then(res => {
            console.log(res)
            setProducts(res.data.results)
            setPagesCount(res.data.pages_count)
        }).catch(err => alert(`${err.response.status} ${err.response.message}`))
    }

    useEffect(_ => {
        loadPage()
    }, [page])


    return (
        <div className='grid gap-5 w-full'>
            {isPhone ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
            <div className='flex items-center gap-2'><p className='text-accent-red text-3xl'><AiFillHeart /></p><Title text='Favourites' /></div>
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {products && products.map((el, key) => <ItemCard product={el} key={key} />)}
            </div>
            <Pagination pagesCount={pagesCount} setPage={setProducts} />
        </div>
    )
}

export default MyFavourites