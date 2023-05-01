import { NavLink } from 'react-router-dom'
import { useDeleteProduct } from '../../api/api'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { BsTrash } from 'react-icons/bs'

const DeleteButton = ({ product }) => {
    const deleteProductMutation = useDeleteProduct()
    const { t } = useTranslation()
    const [toggled, setToggled] = useState()

    return (
        <NavLink
            to=""
            onClick={() =>
                toggled
                    ? deleteProductMutation.mutate(product?.id)
                    : setToggled(true)
            }
            className="flex h-8 w-full items-center gap-2 rounded-lg px-2 text-sm text-accent-red hover:bg-slate-100 dark:text-red-600 hover:dark:bg-zinc-700"
        >
            <BsTrash />
            {toggled ? t('delete_toggled') : t('delete')}
        </NavLink>
    )
}

export default DeleteButton
