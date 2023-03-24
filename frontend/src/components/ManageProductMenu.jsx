import React from 'react'
import { useArchiveProduct, useSellProduct, useDeleteProduct } from '../api/api'
import { NavLink } from 'react-router-dom'
import { IoIosArrowUp } from 'react-icons/io'
import { BsMegaphone, BsPen, BsTrash } from 'react-icons/bs'
import { confirm } from '../utils'
import { useTranslation } from 'react-i18next'

const MenuInner = ({ product }) => {

    const { t } = useTranslation()
    const archiveProductMutation = useArchiveProduct()
    const sellProductMutation = useSellProduct()
    const deleteProductMutation = useDeleteProduct()

    return (
        <div
            className="py-1  gap-2 flex flex-col items-start"
            role="none"
        >
            {!product.is_sold &&
                <NavLink
                    className='text-sm'
                    to=''
                    onClick={() => archiveProductMutation.mutate({ id: product.id, state: product.is_archived })}>
                    {product.is_archived ? t('remove_from_archive') : t('add_to_archive')}
                </NavLink>}
            {!product.is_archived &&
                <NavLink
                    to=''
                    className='text-sm'
                    onClick={() => sellProductMutation.mutate({ id: product.id, state: product.is_sold })}
                >
                    {product.is_sold ? t('publish_again') : t('mark_as_sold')}
                </NavLink>}
            {!product.is_sold &&
                <>
                    <NavLink
                        to={`/products/${product.id}/edit`}
                        className='flex items-center gap-2 text-sm'
                    >
                        <BsPen />{t('edit')}
                    </NavLink>
                    <NavLink
                        to={`/products/${product.id}/promote`}
                        className='flex items-center gap-2 text-sm'
                    >
                        <BsMegaphone />{t('promote')}
                    </NavLink>
                </>
            }
            <NavLink
                to=''
                onClick={() => confirm(
                    `Delete <b>${product.name}</b>`,
                    () => deleteProductMutation.mutate(product.id),
                    `${product.name} has been deleted`,
                    '')}
                className='text-accent-red flex items-center gap-2 text-sm'>
                <BsTrash />{t('delete')}
            </NavLink>
        </div>
    )
}

const ManageProductMenu = ({ product, dropdown }) => {

    const { t } = useTranslation()
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
            <NavLink
                to=''
                type="button"
                className="flex justify-center items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50  focus:ring-offset-gray-100 min-w-32"
                id="menu-button"
                aria-expanded="false">
                {t('manage')}<IoIosArrowUp />
            </NavLink>
        </div>
    )
}

export default ManageProductMenu