import { BsPerson } from 'react-icons/bs'
import { AiFillHeart } from 'react-icons/ai'
import cn from 'classnames'
import { useContext } from 'react'
import AuthContext from '../../contexts/AuthProvider'

const ItemTitleIcon = ({ product, search }) => {
    const { user } = useContext(AuthContext)
    return (
        <span
            className={cn(
                'ml-auto'
                // product?.promotions?.includes('xl')
                //     ? 'md:mt-1.5 xl:mt-2'
                //     : 'md:mt-1 xl:mt-1.5'
            )}
        >
            {product?.user?.id === user?.user_id && search && <BsPerson />}
            {product?.is_favourited && <AiFillHeart color="red" />}
        </span>
    )
}

export default ItemTitleIcon
