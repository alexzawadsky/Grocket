import { useState, useEffect } from 'react'
import { useArchiveProduct, useSellProduct, useDeleteProduct } from '../api/api'
import { NavLink } from 'react-router-dom'
import { IoIosArrowUp, IoMdClose, IoIosArrowDown } from 'react-icons/io'
import { BsMegaphone, BsPen, BsTrash } from 'react-icons/bs'
import { confirm } from '../utils'
import { useTranslation } from 'react-i18next'
import { BsArchive, BsPatchCheck } from 'react-icons/bs'
import { MdOutlineSell } from 'react-icons/md'

const MenuInner = ({ product, fullW }) => {

    const { t } = useTranslation()
    const archiveProductMutation = useArchiveProduct()
    const sellProductMutation = useSellProduct()
    const deleteProductMutation = useDeleteProduct()

    return (
        <div
            className={`border shadow-md rounded-xl p-1 gap-1 flex flex-col items-start ${!fullW && 'w-fit'} bg-white`}
            role="none"
        >
            {!product.is_sold &&
                <NavLink
                    className='text-sm hover:bg-slate-100 h-8 rounded-lg w-full px-2 flex items-center gap-2'
                    to=''
                    onClick={() => archiveProductMutation.mutate({ id: product.id, state: product.is_archived })}
                >
                    {product.is_archived ? <IoMdClose /> : <BsArchive />}
                    {product.is_archived ? t('remove_from_archive') : t('add_to_archive')}
                </NavLink>}
            {!product.is_archived &&
                <NavLink
                    to=''
                    className='text-sm hover:bg-slate-100 h-8 rounded-lg w-full px-2 flex items-center gap-2'
                    onClick={() => sellProductMutation.mutate({ id: product.id, state: product.is_sold })}
                >
                    {product.is_sold ? <MdOutlineSell /> : <BsPatchCheck />}
                    {product.is_sold ? t('publish_again') : t('mark_as_sold')}
                </NavLink>}
            {!product.is_sold && !product.is_archived &&
                <>
                    <NavLink
                        to={`/products/${product.id}/edit`}
                        className='flex items-center gap-2 text-sm hover:bg-slate-100 h-8 rounded-lg w-full px-2'
                    >
                        <BsPen />{t('edit')}
                    </NavLink>
                    <NavLink
                        to={`/products/${product.id}/promote`}
                        className='flex items-center gap-2 text-sm hover:bg-slate-100 h-8 rounded-lg w-full px-2'
                    >
                        <BsMegaphone />{t('promote')}
                    </NavLink >
                </>
            }
            <NavLink
                to=''
                onClick={() => confirm(
                    `Delete <b>${product.name}</b>`,
                    () => deleteProductMutation.mutate(product.id),
                    `${product.name} has been deleted`,
                    '')}
                className='text-accent-red flex items-center gap-2 text-sm hover:bg-slate-100 h-8 rounded-lg w-full px-2'>
                <BsTrash />{t('delete')}
            </NavLink>
        </div >
    )
}

const ManageProductMenu = ({ product, dropdown }) => {

    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (open && !e.target.closest('.manage-menu-drop')) {
                setOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [open])

    if (!dropdown) return <MenuInner product={product} fullW />

    return (
        <div
            className="relative w-fit flex items-end justify-end border-2 rounded-xl text-left group/dropdown"
        >
            {open && <div
                className="w-44 absolute bottom-10 -left-1 z-10 origin-top-right "
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
            >
                <MenuInner product={product} />
            </div>}
            <NavLink
                to=''
                type="button"
                className="flex justify-center items-center gap-2 rounded-xl bg-white px-3 h-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50  focus:ring-offset-gray-100 min-w-32 manage-menu-drop"
                id="menu-button"
                aria-expanded="false"
                onClick={() => setOpen(prevState => !prevState)}
            >
                {t('manage')}{open ? <IoIosArrowDown /> : <IoIosArrowUp />}
            </NavLink>
        </div>
    )
}

export default ManageProductMenu