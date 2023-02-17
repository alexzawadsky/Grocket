import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { BsArrowLeft } from 'react-icons/bs'
import api from '../api/api'
import { alertErr } from '../utils'
import { ItemCard } from '../components'

const UserLots = () => {

    const { userId } = useParams()
    const [products, setProducts] = useState()
    const isPhone = useMediaQuery({ query: '(max-width: 639px)' })

    useEffect(() => {
        api.get(`/api/v1/users/${userId}/products/`).then(res => setProducts(res.data.results)).catch(err => alertErr(err))
    }, [])

    return (
        <div className='grid gap-5'>
            {isPhone ? <NavLink className='flex items-center gap-2' to={`/user/${userId}`}><BsArrowLeft />Back to profile</NavLink> : null}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products && products.map((el, key) => <ItemCard product={el} key={key} />)}
            </div>
        </div>
    )
}

export default UserLots