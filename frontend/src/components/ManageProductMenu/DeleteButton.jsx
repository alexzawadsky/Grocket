import { NavLink } from "react-router-dom"
import { useDeleteProduct } from "../../api/api"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { BsTrash } from "react-icons/bs"

const DeleteButton = ({ product }) => {

    const deleteProductMutation = useDeleteProduct()
    const { t } = useTranslation()
    const [toggled, setToggled] = useState()

    return (
        <NavLink
            to=''
            onClick={() => toggled ? deleteProductMutation.mutate(product?.id) : setToggled(true)}
            className='text-accent-red dark:text-red-600 flex items-center gap-2 text-sm hover:bg-slate-100 hover:dark:bg-zinc-700 h-8 rounded-lg w-full px-2'>
            <BsTrash />{toggled ? t('delete_toggled') : t('delete')}
        </NavLink>
    )
}

export default DeleteButton