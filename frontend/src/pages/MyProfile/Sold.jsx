import React, { useEffect, useState } from 'react'
import useAxios from '../../hooks/useAxios'
import { useMediaQuery } from 'react-responsive'
import { NavLink } from 'react-router-dom'
import { Pagination, MyLot } from '../../components'
import { BsArrowLeft } from 'react-icons/bs'

const Sold = () => {
    const [products, setProducts] = useState()
    const [page, setPage] = useState(0)
    const [pagesCount, setPagesCount] = useState(0)
    const isPhone = useMediaQuery({ query: '(max-width: 639px)' })
    const api = useAxios()


    const loadPage = () => {
        api.get(`/api/v1/users/me/products/?limit=4&page=${page + 1}&is_sold=1`).then(res => {
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
            <h1 className='font-bold text-3xl'>Sold items</h1>
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {products && products.map((el, key) => <MyLot product={el} key={key} />)}
            </div>
            <Pagination pagesCount={pagesCount} setPage={setProducts} />
        </div>
    )
}

export default Sold