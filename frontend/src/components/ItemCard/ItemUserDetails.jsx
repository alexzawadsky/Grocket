import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { RatingStars, Avatar } from '../ui'
import { FiMail } from 'react-icons/fi'
import { TbPhoneCheck } from 'react-icons/tb'
import AuthContext from '../../contexts/AuthProvider'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import useScreen from '../../hooks/useScreen'

const ItemUserDetails = ({ product, search, horizontal }) => {
    const { user } = useContext(AuthContext)
    const { t } = useTranslation()
    const isXL = product.promotions.includes('xl')
    const { isMinTablet, isLargePC } = useScreen()

    if (!search) return
    if (!isMinTablet && !isXL) return
    if (isMinTablet && horizontal && !isLargePC) return
    if (isMinTablet && !horizontal && !isXL) return
    return (
        <div
            className={cn(
                'h-full gap-4 text-sm xl:flex',
                horizontal ? 'xl:px-4 xl:py-7' : ''
            )}
        >
            {horizontal && isMinTablet && (
                <Link
                    to={
                        product?.user?.id === user?.user_id
                            ? '/users/me'
                            : `/users/${product?.user?.id}`
                    }
                    className={cn('h-fit drop-shadow-sm hover:drop-shadow-md')}
                >
                    <Avatar avatar={product?.user?.avatar} width={40} />
                </Link>
            )}
            <div className="flex flex-col gap-1.5">
                <Link
                    to={
                        product?.user?.id === user?.user_id
                            ? '/users/me'
                            : `/users/${product?.user?.id}`
                    }
                    className="font-bold hover:text-accent-orange"
                >
                    {product?.user?.first_name} {product?.user?.last_name}{' '}
                    {product?.user?.id === user?.user_id && `(${t('me')})`}
                </Link>
                <div className="flex flex-wrap items-center gap-1.5">
                    <RatingStars rating={product?.user?.rating} />
                    <Link
                        to={
                            product?.user?.id === user?.user_id
                                ? '/users/me/comments'
                                : `/users/${product?.user?.id}/comments`
                        }
                        className="text-sm hover:text-accent-orange"
                    >
                        {horizontal &&
                            isMinTablet &&
                            `${t('comments')} (${
                                product?.user?.comments_count
                            })`}
                    </Link>
                </div>
                {horizontal && isMinTablet && (
                    <>
                        <p>
                            {product?.user?.sold_count} {t('items_sold')}
                        </p>
                        {product?.user?.id !== user?.user_id && (
                            <Link
                                className="flex h-fit items-center gap-2 text-accent-orange hover:underline max-md:hidden"
                                to={`/messenger/${product?.slug}`}
                            >
                                <FiMail />
                                {t('send_message')}
                            </Link>
                        )}
                        {product?.user?.phone_verified && (
                            <p className="mt-auto flex w-fit items-center gap-2 rounded-full bg-green-100 px-2 py-1 text-sm font-bold text-green-600 dark:bg-green-800 dark:text-green-300">
                                <TbPhoneCheck />
                                {t('phone_verified')}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ItemUserDetails
