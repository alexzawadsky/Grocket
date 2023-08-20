import { BsPerson } from 'react-icons/bs'
import { AiFillHeart } from 'react-icons/ai'
import { useContext } from 'react'
import AuthContext from '../../contexts/AuthProvider'

const ItemTitleIcon = ({ product, managable }) => {
    const { user } = useContext(AuthContext)
    return (
        <span className="ml-auto">
            {product?.user?.id === user?.user_id && !managable && <BsPerson />}
            {product?.is_favourited && <AiFillHeart color="red" />}
        </span>
    )
}

export default ItemTitleIcon
