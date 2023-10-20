import React from 'react'
import useScreen from '../../../hooks/useScreen'
import { Link } from 'react-router-dom'
import { Avatar, Flag, Price } from '../../../components/ui'
import { IoCloseOutline } from 'react-icons/io5'
import { RxDotFilled, RxDot } from 'react-icons/rx'
import { useTranslation } from 'react-i18next'

const ChatHeader = ({ chat }) => {
    const { isMinTablet } = useScreen()
    const { t } = useTranslation()
    const online = true

    const onlineSymbol = online ? <RxDotFilled color="#008000" /> : <RxDot />

    return (
        <div className="flex justify-between gap-2 border-b pb-3 dark:border-b-2 dark:border-zinc-600 max-lg:flex-col max-lg:gap-3">
            <div className="flex gap-2">
                <Link to="/messenger" className="my-auto">
                    <IoCloseOutline size={25} />
                </Link>
                {chat && (
                    <>
                        <Link
                            to={`/users/${chat?.user?.id}`}
                            className="flex items-center gap-1 hover:text-accent-orange md:gap-3"
                        >
                            <Avatar avatar={chat?.user?.avatar} width={30} />
                            <p className="flex items-center md:text-lg">
                                {!isMinTablet && onlineSymbol}{' '}
                                {chat?.user?.first_name}{' '}
                                {isMinTablet
                                    ? chat?.user?.last_name
                                    : `${chat?.user?.last_name[0]}.`}
                            </p>
                            <Flag country={chat?.user?.country} width={20} />
                        </Link>
                        {/* <span className="hidden items-center md:flex">
                            {onlineSymbol}
                            {isMinTablet && online ? t('online') : t('offline')}
                        </span> */}
                    </>
                )}
            </div>
            {chat && (
                <Link
                    to={`/products/${chat?.product?.slug}`}
                    className="flex w-fit items-center gap-3 hover:text-accent-orange max-md:text-sm"
                >
                    <img
                        src={chat?.product?.image?.image}
                        className="w-10 rounded-md"
                    />
                    {chat?.product?.name} -{' '}
                    <Price price={chat?.product?.price} text />
                </Link>
            )}
        </div>
    )
}

export default ChatHeader
