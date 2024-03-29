import { useState, useEffect } from 'react'
import { useArchiveProduct, useSellProduct } from '../../api/api'
import { Link } from 'react-router-dom'
import {
    IoIosArrowUp,
    IoMdClose,
    IoIosArrowDown,
    IoIosArrowForward,
    IoIosArrowBack,
} from 'react-icons/io'
import { BsMegaphone, BsPen } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'
import { BsArchive, BsPatchCheck } from 'react-icons/bs'
import { MdOutlineSell } from 'react-icons/md'
import DeleteButton from './DeleteButton'
import useScreen from '../../hooks/useScreen'
import cn from 'classnames'

const MenuInner = ({ product, fullW }) => {
    const { t } = useTranslation()
    const archiveProductMutation = useArchiveProduct()
    const sellProductMutation = useSellProduct()

    return (
        <div
            className={cn(
                `flex flex-col items-start gap-1 
                rounded-xl border bg-white p-1 shadow-md 
                dark:border-2 dark:border-zinc-600 dark:bg-zinc-800`,
                fullW ? 'w-full' : 'w-fit'
            )}
            role="none"
        >
            {!product.is_sold && (
                <Link
                    className="flex h-8 w-full items-center gap-2 rounded-lg px-2 text-sm hover:bg-slate-100 hover:dark:bg-zinc-700"
                    to=""
                    onClick={() =>
                        archiveProductMutation.mutate({
                            id: product.id,
                            state: product.is_archived,
                        })
                    }
                >
                    {product.is_archived ? <IoMdClose /> : <BsArchive />}
                    {product.is_archived
                        ? t('remove_from_archive')
                        : t('add_to_archive')}
                </Link>
            )}
            {!product.is_archived && (
                <Link
                    to=""
                    className="flex h-8 w-full items-center gap-2 rounded-lg px-2 text-sm hover:bg-slate-100 hover:dark:bg-zinc-700"
                    onClick={() =>
                        sellProductMutation.mutate({
                            id: product.id,
                            state: product.is_sold,
                        })
                    }
                >
                    {product.is_sold ? <MdOutlineSell /> : <BsPatchCheck />}
                    {product.is_sold ? t('publish_again') : t('mark_as_sold')}
                </Link>
            )}
            {!product.is_sold && !product.is_archived && (
                <>
                    <Link
                        to={`/products/${product?.slug}/edit`}
                        className="flex h-8 w-full items-center gap-2 rounded-lg px-2 text-sm hover:bg-slate-100 hover:dark:bg-zinc-700"
                    >
                        <BsPen />
                        {t('edit')}
                    </Link>
                    <Link
                        to={`/products/${product?.slug}/promote`}
                        className="flex h-8 w-full items-center gap-2 rounded-lg px-2 text-sm hover:bg-slate-100 hover:dark:bg-zinc-700"
                    >
                        <BsMegaphone />
                        {t('promote')}
                    </Link>
                </>
            )}
            <DeleteButton product={product} />
        </div>
    )
}

const ManageProductMenu = ({ product, dropdown, className }) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const { isMinTablet } = useScreen()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (open && !e.target.closest(`.manage-menu-drop-${product?.id}`)) {
                setOpen(false)
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
            className={`group/dropdown relative flex w-fit items-end justify-end rounded-xl text-left md:flex-row manage-menu-drop-${product?.id} ${className}`}
        >
            <div
                className={cn(
                    open ? 'block' : 'hidden',
                    'absolute bottom-10 z-50 w-44 origin-top-right transition-all max-md:-left-1 md:bottom-0 md:left-[110%] md:w-52'
                )}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
            >
                <MenuInner product={product} fullW />
            </div>
            <Link
                to=""
                type="button"
                className="min-w-32 flex h-8 items-center justify-center gap-2 rounded-xl border bg-white px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-gray-100 dark:border-2  dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 hover:dark:bg-zinc-600 dark:focus:ring-offset-zinc-600"
                id="menu-button"
                aria-expanded="false"
                onClick={() => setOpen((prevState) => !prevState)}
            >
                {t('manage')}
                {isMinTablet ? (
                    <IoIosArrowForward
                        className={cn(
                            open ? 'rotate-180' : null,
                            'transition-transform'
                        )}
                    />
                ) : (
                    <IoIosArrowUp
                        className={cn(
                            open ? 'rotate-180' : null,
                            'transition-transform'
                        )}
                    />
                )}
            </Link>
        </div>
    )
}

export default ManageProductMenu
