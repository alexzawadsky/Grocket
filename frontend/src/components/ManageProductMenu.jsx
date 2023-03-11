import React from 'react'
import { useArchiveProduct, useSellProduct, useDeleteProduct } from '../api/api'
import { BsMegaphoneFill, BsTrashFill } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import { IoIosArrowUp } from 'react-icons/io'
import { BiPencil } from 'react-icons/bi'
import { BsFillMegaphoneFill } from 'react-icons/bs'
import { confirm } from '../utils'

const MenuInner = ({ product }) => {

    const archiveProductMutation = useArchiveProduct()
    const sellProductMutation = useSellProduct()
    const deleteProductMutation = useDeleteProduct()

    return (
        <div
            className="py-1  gap-2 flex flex-col items-start"
            role="none"
        >
            {!product.is_sold &&
                <button
                    className='text-sm'
                    onClick={() => archiveProductMutation.mutate({ id: product.id, state: product.is_archived })}>
                    {product.is_archived ? 'Remove from archive' : 'Add to archive'}
                </button>}
            {!product.is_archived &&
                <button
                    className='text-sm'
                    onClick={() => sellProductMutation.mutate({ id: product.id, state: product.is_sold })}
                >
                    {product.is_sold ? 'Publish again' : 'Mark as sold'}
                </button>}
            {!product.is_sold &&
                <>
                    <NavLink
                        to={`/products/${product.id}/edit`}
                        className='flex items-center gap-2 text-sm'
                    >
                        <BiPencil />Edit
                    </NavLink>
                    <NavLink
                        to={`/products/${product.id}/promote`}
                        className='flex items-center gap-2 text-sm'
                    >
                        <BsMegaphoneFill />Promote
                    </NavLink>
                </>
            }
            <button
                onClick={() => confirm(
                    `Delete <b>${product.name}</b>`,
                    () => deleteProductMutation.mutate(product.id),
                    `${product.name} has been deleted`,
                    '')}
                className='text-accent-red flex items-center gap-2 text-sm'>
                <BsTrashFill />Delete
            </button>
        </div>
    )
}

const ManageProductMenu = ({ product, dropdown }) => {

    if (!dropdown) return <MenuInner product={product} />

    return (
        <div
            className="relative w-fit flex items-end justify-end text-left group/dropdown"
        >
            <div
                className="hidden w-44 group-hover/dropdown:block absolute -bottom-0 left-0 z-10 p-2  origin-top-right rounded-md bg-white border-2"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
            >
                <MenuInner product={product} />
            </div>
            <button
                type="button"
                className="flex justify-center items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50  focus:ring-offset-gray-100 min-w-32"
                id="menu-button"
                aria-expanded="false">
                Manage<IoIosArrowUp />
            </button>
        </div>
    )
}

export default ManageProductMenu