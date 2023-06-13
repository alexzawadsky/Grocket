import { Link } from 'react-router-dom'
import { BiCategoryAlt, BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { AiFillHeart } from 'react-icons/ai'
import { useContext } from 'react'
import AuthContext from '../../contexts/AuthProvider'
import ImagesCarousel from '../ImagesCarousel/ImagesCarousel'
import ManageProductMenu from '../ManageProductMenu/ManageProductMenu'
import useScreen from '../../hooks/useScreen'
import { FiMail } from 'react-icons/fi'
import { TbPhoneCheck } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { Flag, RatingStars, Avatar, Price, PublishTime } from '../ui'
import cn from 'classnames'
import { BsPerson } from 'react-icons/bs'

const ItemCard = ({
    product,
    managable = false,
    search = false,
    horizontal,
}) => {
    const { isLargePC, isMinTablet, isMinPC } = useScreen()
    const { user } = useContext(AuthContext)
    const { t } = useTranslation()

    if (horizontal && isMinTablet)
        return (
            <Link
                className="grid h-fit grid-cols-[1fr_2fr] items-center overflow-hidden rounded-2xl p-5 transition-all duration-150 hover:bg-slate-50 hover:dark:bg-zinc-700 xl:grid-cols-[1fr_2fr_1fr]"
                to={`/products/${product?.slug}`}
            >
                <div className="grid grid-cols-2 gap-1">
                    {search && product?.promotions.includes('xl') ? (
                        <>
                            <img
                                className="col-span-full rounded-lg"
                                src={product?.images[0]?.image}
                            />
                            <img
                                className="rounded-lg"
                                src={product?.images[1]?.image}
                            />
                            <img
                                className="rounded-lg"
                                src={product?.images[2]?.image}
                            />
                        </>
                    ) : (
                        <div className="col-span-full overflow-hidden rounded-lg">
                            <ImagesCarousel images={product?.images} />
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        'flex h-full flex-col items-start justify-center px-4',
                        search && product?.promotions.includes('xl')
                            ? 'gap-2 lg:gap-3'
                            : 'gap-1 lg:gap-2'
                    )}
                >
                    <div className="flex w-full items-center gap-2">
                        <Flag
                            size={5}
                            country={product?.address?.country_code}
                            className={cn(
                                'mb-auto h-fit',
                                search && product?.promotions.includes('xl')
                                    ? 'mt-1 xl:mt-1.5'
                                    : 'mt-0.5 xl:mt-1'
                            )}
                        />
                        <p
                            className={cn(
                                `line-clamp-2 font-bold hover:text-accent-orange`,
                                search && product?.promotions.includes('xl')
                                    ? 'text-lg xl:text-2xl'
                                    : 'text-md xl:text-xl'
                            )}
                        >
                            {product?.name}
                        </p>
                        <span
                            className={cn(
                                'mb-auto ml-auto',
                                product?.promotions?.includes('xl')
                                    ? 'mt-1.5 xl:mt-2'
                                    : 'mt-1 xl:mt-1.5'
                            )}
                        >
                            {product?.user?.id === user?.user_id && search && (
                                <BsPerson />
                            )}
                            {product?.is_favourited && (
                                <AiFillHeart color="red" />
                            )}
                        </span>
                    </div>
                    <p
                        className={`overflow-hidden text-ellipsis ${
                            search && product?.promotions.includes('xl')
                                ? 'lg:text-md line-clamp-3 text-sm'
                                : 'line-clamp-2 text-sm'
                        }`}
                    >
                        {product?.description}
                    </p>
                    {search && product?.promotions.includes('price') ? (
                        <span className="relative ml-1.5 inline-block px-1 before:absolute before:-inset-1 before:block before:-skew-x-[10deg] before:rounded-sm before:bg-accent-orange">
                            <span className="relative text-white">
                                <Price
                                    className="font-bolditalic text-lg leading-none lg:text-2xl"
                                    price={product?.price}
                                />
                            </span>
                        </span>
                    ) : (
                        <Price
                            className="text-md font-bolditalic leading-none lg:text-xl"
                            price={product?.price}
                        />
                    )}
                    <div>
                        <p
                            className={`flex items-center gap-2 ${
                                search && product?.promotions.includes('xl')
                                    ? 'lg:text-md text-sm'
                                    : 'text-[12px] lg:text-sm'
                            }`}
                        >
                            <BiTimeFive />
                            <PublishTime pubDate={product?.pub_date} />
                        </p>
                        <p
                            className={`flex items-center gap-2 ${
                                search && product?.promotions.includes('xl')
                                    ? 'lg:text-md text-sm'
                                    : 'text-[12px] lg:text-sm'
                            }`}
                        >
                            <FiMapPin />
                            {product?.address?.short} {product?.address?.city}
                        </p>
                        <p
                            className={`flex items-center gap-2 ${
                                search && product?.promotions.includes('xl')
                                    ? 'lg:text-md text-sm'
                                    : 'text-[12px] lg:text-sm'
                            }`}
                        >
                            <BiCategoryAlt />
                            {product?.category?.title}
                        </p>
                    </div>
                </div>
                {isLargePC && search && (
                    <div className="hidden h-full gap-4 px-4 py-7 text-sm lg:flex">
                        <Link
                            to={
                                product?.user?.id === user?.user_id
                                    ? '/users/me'
                                    : `/users/${product?.user?.id}`
                            }
                            className="h-fit drop-shadow-sm hover:drop-shadow-md"
                        >
                            <Avatar avatar={product?.user?.avatar} width={40} />
                        </Link>
                        <div className="flex flex-col gap-1.5">
                            <Link
                                to={
                                    product?.user?.id === user?.user_id
                                        ? '/users/me'
                                        : `/users/${product?.user?.id}`
                                }
                                className="font-bold hover:text-accent-orange"
                            >
                                {product?.user?.first_name}{' '}
                                {product?.user?.last_name}{' '}
                                {product?.user?.id === user?.user_id &&
                                    `(${t('me')})`}
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
                                    {t('comments')} (
                                    {product?.user?.comments_count})
                                </Link>
                            </div>
                            <p>
                                {product?.user?.sold_count} {t('items_sold')}
                            </p>
                            {product?.user?.id !== user?.user_id && (
                                <Link
                                    className="flex h-fit items-center gap-2 text-accent-orange hover:underline"
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
                        </div>
                    </div>
                )}
                {managable && (
                    <ManageProductMenu
                        product={product}
                        dropdown={!isLargePC}
                        className="max-xl:mt-3"
                    />
                )}
            </Link>
        )

    return (
        <Link
            to={`/products/${product?.slug}`}
            className={cn(
                `rounded-2xl md:p-5 hover:md:bg-slate-50 hover:md:dark:bg-zinc-700`,
                search && 'pb-5',
                `flex h-full flex-col gap-2 transition-all duration-150`
            )}
        >
            <ImagesCarousel images={product?.images} />
            <div className="flex items-center gap-2">
                <Flag
                    size={5}
                    country={product?.address?.country_code}
                    className="mb-auto mt-1"
                />
                <p
                    className={`${
                        search ? 'text-xl font-bold' : 'my-auto text-lg'
                    } line-clamp-2 w-fit justify-between hover:text-accent-orange`}
                >
                    {product?.name}
                </p>
                <span className="mb-auto ml-auto mt-1.5">
                    {product?.user?.id === user?.user_id && <BsPerson />}
                    {product?.is_favourited && <AiFillHeart color="red" />}
                </span>
            </div>
            {search && product?.promotions.includes('price') ? (
                <span className="relative ml-1.5 inline-block w-fit px-1 before:absolute before:-inset-1 before:block before:-skew-x-[10deg] before:rounded-sm before:bg-accent-orange">
                    <span className="relative text-white">
                        <Price
                            className="font-bolditalic text-lg leading-none lg:text-2xl"
                            price={product?.price}
                        />
                    </span>
                </span>
            ) : (
                <Price
                    className="text-md font-bolditalic leading-none lg:text-xl"
                    price={product?.price}
                />
            )}
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-1.5 gap-y-0.5">
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
            {search && product?.promotions.includes('xl') && (
                <div className="flex flex-col gap-0.5">
                    <Link
                        to={
                            product?.user?.id === user?.user_id
                                ? '/users/me'
                                : `/users/${product?.user?.id}`
                        }
                        className="flex items-center gap-1 font-bold hover:text-accent-orange"
                    >
                        {product?.user?.phone_verified && (
                            <p className="mr-1.5 flex w-fit items-center gap-2 rounded-full bg-green-100 px-2 py-1 text-sm font-bold text-green-600 dark:bg-green-800 dark:text-green-300">
                                <TbPhoneCheck />
                            </p>
                        )}
                        <div className="flex flex-wrap gap-1 text-[12px] 2xl:text-sm">
                            <p>{product?.user?.first_name}</p>
                            <p>{product?.user?.last_name}</p>
                            <p>
                                {product?.user?.id === user?.user_id &&
                                    `(${t('me')})`}
                            </p>
                        </div>
                    </Link>
                    <div className="flex flex-wrap items-center justify-between gap-1.5 ">
                        <RatingStars rating={product?.user?.rating} />
                    </div>
                </div>
            )}
            {managable && user?.user_id === product?.user?.id && (
                <div className="mt-auto grid gap-2">
                    <ManageProductMenu product={product} dropdown />
                </div>
            )}
        </Link>
    )
}

export default ItemCard
