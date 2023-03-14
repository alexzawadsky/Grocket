import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { BsArrowLeft } from 'react-icons/bs'
import api from '../../api/api'
import { alertErr } from '../../utils'
import { ItemCard, Pagination } from '../../components'
import useScreen from '../../hooks/useScreen'

const UserLots = () => {

    const { userId } = useParams()
    const [products, setProducts] = useState()
    const [page, setPage] = useState(0)
    const [pagesCount, setPagesCount] = useState(1)
    const { isMaxPhone } = useScreen()


    const loadPage = () => {
        api.get(`/api/v1/users/${userId}/products/?limit=4&page=${page + 1}`).then(res => {
            setProducts(res.data.results)
            setPagesCount(res.data.pages_count)
        }).catch(err => alertErr(err))
    }

    useEffect(_ => {
        loadPage()
    }, [page])

    return (
        <div className='grid gap-5'>
            {isMaxPhone ? <NavLink className='flex items-center gap-2' to={`/user/${userId}`}><BsArrowLeft />Back to profile</NavLink> : null}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products && products.map((el, key) => <ItemCard product={el} key={key} />)}
            </div>
            <Pagination pagesCount={pagesCount} setPage={setPage} />
        </div>
    )
}

export default UserLots