import React from 'react'
import { NavLink } from 'react-router-dom'
import { BiCategoryAlt, BiTimeFive, BiPencil } from 'react-icons/bi'
import { BsTrashFill } from 'react-icons/bs'

const MyLot = ({ product }) => {
    return (
        <div to={`/product/${product.id}`} className='border-black border-2 rounded-2xl overflow-hidden flex flex-col'>
            <NavLink to={`/products/${product.id}`} className="">
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
                <div className="">
                    {product.is_sold ? <button className='hover:underline hover:text-accent-orange w-fit'>Remove from sold</button> : null}
                    {product.is_archived ? <button className='hover:underline hover:text-accent-orange w-fit'>Remove from archive</button> : null}
                    {!product.is_sold && !product.is_archived ?
                        <>
                            <button className='hover:underline hover:text-accent-orange w-fit'>Move to archive</button>
                            <button className='hover:underline hover:text-accent-orange w-fit'>Mark as selled</button>
                        </>
                        : null}
                </div>

                <div className="flex gap-2 items-center">
                    {!product.is_sold && <button className='text-accent-orange'><BiPencil /></button>}
                    <button className='text-accent-red'><BsTrashFill /></button>
                </div>
            </div>
        </div>
    )
}

export default MyLot