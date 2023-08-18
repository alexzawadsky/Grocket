import React, { useContext } from 'react'
import { PublishTime } from '../ui'
import { BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { BiCategoryAlt } from 'react-icons/bi'
import cn from 'classnames'
import useScreen from '../../hooks/useScreen'
import AuthContext from '../../contexts/AuthProvider'

const ItemDetails = ({ product, search, managable }) => {
    const { isMinTablet } = useScreen()
    const { user } = useContext(AuthContext)
    return (
        <div
            className={cn(
                'grid grid-cols-[auto_1fr] items-center gap-x-1.5 gap-y-0.5',
                search && product?.promotions.includes('xl')
                    ? 'lg:text-md text-sm'
                    : 'text-[12px] lg:text-sm'
            )}
        >
            <BiTimeFive />
            <time className="line-clamp-1 text-sm">
                <PublishTime pubDate={product?.pub_date} />
            </time>
            {(!managable || user?.user_id !== product?.user?.id) && (
                <>
                    <FiMapPin />
                    <p className="line-clamp-1 text-sm">
                        {product?.address?.short} {product?.address?.city}
                    </p>
                </>
            )}
            {(isMinTablet || search) && (
                <>
                    <BiCategoryAlt />
                    <p className="line-clamp-1 text-sm">
                        {product?.category?.title}
                    </p>
                </>
            )}
        </div>
    )
}

export default ItemDetails
