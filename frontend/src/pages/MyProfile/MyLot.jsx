import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BiCategoryAlt, BiTimeFive, BiPencil } from 'react-icons/bi'
import { BsTrashFill } from 'react-icons/bs'
import useAxios from '../../hooks/useAxios'
import { alertErr, confirm, notification } from '../../utils'
import { IoIosArrowUp } from 'react-icons/io'

const MyLot = ({ product }) => {

    const [sold, setSold] = useState(product.is_sold)
    const [archived, setArchived] = useState(product.is_archived)
    const [deleted, setDeleted] = useState(false)
    const api = useAxios()

    const sell = () => {
        api({ url: `/api/v1/products/${product.id}/sell/`, method: sold ? 'DELETE' : 'POST' })
            .then(_ => setSold(!sold)).catch(err => alertErr(err))
    }

    const archive = () => {
        api({ url: `/api/v1/products/${product.id}/archive/`, method: archived ? 'DELETE' : 'POST' })
            .then(_ => setArchived(!archived)).catch(err => alertErr(err))
    }

    const del = () => {
        api.delete(`/api/v1/products/${product.id}/`)
            .then(_ => {
                notification(`<b>${product.name}</b> has been deleted`)
                setDeleted(true)
            }).catch(err => alertErr(err))
    }

    return (
        <div to={`/product/${product.id}`} className='border-black border-2 rounded-2xl flex flex-col'>
            <NavLink to={`/products/${product.id}`} className="overflow-hidden">
                {product.images ? <img src={product.images[0].image} className='' /> : null}
            </NavLink>
            <div className='p-3 md:p-5 flex justify-around flex-col gap-2 grow'>
                <NavLink to={`/products/${product.id}`} className='hover:text-accent-orange text-sm xl:text-lg'>{product.name}</NavLink>
                <p className='font-bolditalic text-md xl:text-xl leading-none'>{parseFloat(product.price).toFixed(0)} {product.price_currency}</p>
                <div className='grid gap-y-1.5 xl:gap-y-1 grid-cols-[auto_1fr] gap-x-2 items-center'>
                    <BiCategoryAlt />
                    <p className='text-[0.6rem] xl:text-sm truncate'>{product.category.title}</p>
                    <BiTimeFive />
                    <p className='flex items-center gap-2 text-[0.6rem] xl:text-sm'>
                        {new Date(product.pub_date).toLocaleDateString(undefined,
                            { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
                        )}
                    </p>
                </div>
            </div>
            <div className='grid gap-2 pt-0 p-5'>
                <div className="relative w-fit flex items-end justify-end text-left group/dropdown">
                    <div className="hidden w-44 group-hover/dropdown:block absolute -bottom-0 left-0 z-10 p-2  origin-top-right rounded-md bg-white border-2" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                        <div className="py-1  gap-2 flex flex-col items-start" role="none">
                            {!sold && <button className='text-sm' onClick={archive}>{archived ? 'Remove from archive' : 'Add to archive'}</button>}
                            {!archived && <button className='text-sm' onClick={sell}>{sold ? 'Publish again' : 'Mark as sold'}</button>}
                            {!sold && <NavLink to={`/products/${product.id}/edit`} className='flex items-center gap-2 text-sm'><BiPencil />Edit</NavLink>}
                            <button onClick={() => confirm(`Delete <b>${product.name}</b>`, del, `${product.name} has been deleted`, '')} className='text-accent-red flex items-center gap-2 text-sm'><BsTrashFill />Delete</button>
                        </div>
                    </div>
                    <button type="button" className="flex justify-center items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50  focus:ring-offset-gray-100 min-w-32" id="menu-button" aria-expanded="false">
                        Manage<IoIosArrowUp />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MyLot