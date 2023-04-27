import { useState, useEffect } from 'react'
import { useArchiveProduct, useSellProduct } from '../../api/api'
import { Link } from 'react-router-dom'
import { IoIosArrowUp, IoMdClose, IoIosArrowDown } from 'react-icons/io'
import { BsMegaphone, BsPen } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import { BsArchive, BsPatchCheck } from 'react-icons/bs'
import { MdOutlineSell } from 'react-icons/md'
import DeleteButton from './DeleteButton'

const MenuInner = ({ product, fullW }) => {

    const { t } = useTranslation()
    const archiveProductMutation = useArchiveProduct()
    const sellProductMutation = useSellProduct()

    return (
        <div
            className={`border dark:border-2 dark:border-zinc-600 shadow-md rounded-xl p-1 gap-1 flex flex-col items-start ${!fullW && 'w-fit'} bg-white dark:bg-zinc-800`}
            role="none"
        >
            {!product.is_sold &&
                <Link
                    className='text-sm hover:bg-slate-100 hover:dark:bg-zinc-700 h-8 rounded-lg w-full px-2 flex items-center gap-2'
                    to=''
                    onClick={() => archiveProductMutation.mutate({ id: product.id, state: product.is_archived })}
                >
                    {product.is_archived ? <IoMdClose /> : <BsArchive />}
                    {product.is_archived ? t('remove_from_archive') : t('add_to_archive')}
                </Link>}
            {!product.is_archived &&
                <Link
                    to=''
                    className='text-sm hover:bg-slate-100 hover:dark:bg-zinc-700 h-8 rounded-lg w-full px-2 flex items-center gap-2'
                    onClick={() => sellProductMutation.mutate({ id: product.id, state: product.is_sold })}
                >
                    {product.is_sold ? <MdOutlineSell /> : <BsPatchCheck />}
                    {product.is_sold ? t('publish_again') : t('mark_as_sold')}
                </Link>}
            {!product.is_sold && !product.is_archived &&
                <>
                    <Link
                        to={`/products/${product?.slug}/edit`}
                        className='flex items-center gap-2 text-sm hover:bg-slate-100 hover:dark:bg-zinc-700 h-8 rounded-lg w-full px-2'
                    >
                        <BsPen />{t('edit')}
                    </Link>
                    <Link
                        to={`/products/${product?.slug}/promote`}
                        className='flex items-center gap-2 text-sm hover:bg-slate-100 hover:dark:bg-zinc-700 h-8 rounded-lg w-full px-2'
                    >
                        <BsMegaphone />{t('promote')}
                    </Link >
                </>
            }
            <DeleteButton product={product} />
        </div >
    )
}

const ManageProductMenu = ({ product, dropdown }) => {

    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (open && !e.target.closest(`.manage-menu-drop-${product?.id}`)) {
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
            className={`relative w-fit flex items-end justify-end  rounded-xl text-left group/dropdown manage-menu-drop-${product?.id}`}
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
            <Link
                to=''
                type="button"
                className="flex justify-center items-center gap-2 rounded-xl bg-white dark:bg-zinc-800 dark:text-zinc-50 hover:dark:bg-zinc-600 px-3 h-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50  focus:ring-offset-gray-100 dark:focus:ring-offset-zinc-600 min-w-32 border-2 dark:border-zinc-600"
                id="menu-button"
                aria-expanded="false"
                onClick={() => setOpen(prevState => !prevState)}
            >
                {t('manage')}{open ? <IoIosArrowDown /> : <IoIosArrowUp />}
            </Link>
        </div>
    )
}

export default ManageProductMenu