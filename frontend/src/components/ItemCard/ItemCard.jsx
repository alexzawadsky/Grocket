import { NavLink } from 'react-router-dom'
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

const ItemCard = ({ product, managable = false, search = false, horizontal }) => {

    const { isLargePC, isMinTablet } = useScreen()
    const { user } = useContext(AuthContext)
    const { t } = useTranslation()


    if (horizontal && isMinTablet) return (
        <NavLink className='grid grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2fr_1fr] rounded-2xl items-center overflow-hidden h-fit p-5 hover:bg-slate-50 hover:dark:bg-zinc-700 transition-all duration-150' to={`/products/${product?.slug}`}>
            <div className='grid grid-cols-2 gap-1'>
                <div className="col-span-full rounded-lg overflow-hidden">
                    <ImagesCarousel images={product?.images} />
                </div>
                {product?.promotions.includes('xl') &&
                    <>
                        <img className='rounded-lg' src={product?.images[1]?.image} />
                        <img className='rounded-lg' src={product?.images[2]?.image} />
                    </>
                }
            </div>
            <div className={cn(
                'flex items-start h-full flex-col justify-center p-4',
                product?.promotions.includes('xl') ? 'gap-2 lg:gap-3' : 'gap-1 lg:gap-2',
            )}>
                <div className="flex items-center w-full gap-2">
                    <Flag size={5} country={product?.address?.country_code} className='mb-auto h-fit mt-[3px]' />
                    <p className={`font-bold hover:text-accent-orange flex items-center justify-between ${product?.promotions.includes('xl') ? 'text-md xl:text-2xl' : 'text-md xl:text-xl'}`} >
                        {product?.name}
                    </p>
                    <span className='ml-auto'>
                        {product?.is_favourited && <AiFillHeart color='red' />}
                    </span>
                </div>
                <p
                    className={`text-ellipsis overflow-hidden ${product?.promotions.includes('xl') ? 'text-sm lg:text-md' : 'text-sm'}`}
                    style={{
                        lineClamp: 2,
                        WebkitLineClamp: 2
                    }}
                >
                    {product?.description?.slice(0, product?.promotions?.includes('xl') ? 200 : 100)}{product?.description.length > (product?.promotions.includes('xl') ? 200 : 100) ? '...' : ''}
                </p>
                {product?.promotions.includes('price') ?
                    <span className="before:block before:absolute before:-inset-1 before:-skew-x-[10deg] before:bg-accent-orange relative inline-block px-1 before:rounded-sm ml-1.5">
                        <span className="relative text-white"><Price
                            className='font-bolditalic leading-none text-lg lg:text-2xl'
                            price={product?.price}
                        />
                        </span>
                    </span>
                    :
                    <Price
                        className='font-bolditalic leading-none text-md lg:text-xl'
                        price={product?.price}
                    />
                }
                <div>
                    <p className={`flex items-center gap-2 ${product?.promotions.includes('xl') ? 'text-sm lg:text-md' : 'text-[12px] lg:text-sm'}`}>
                        <BiTimeFive />
                        <PublishTime pubDate={product?.pub_date} />
                    </p>
                    <p className={`flex items-center gap-2 ${product?.promotions.includes('xl') ? 'text-sm lg:text-md' : 'text-[12px] lg:text-sm'}`}>
                        <FiMapPin />
                        {product?.address?.short} {product?.address?.city}
                    </p>
                    <p className={`flex items-center gap-2 ${product?.promotions.includes('xl') ? 'text-sm lg:text-md' : 'text-[12px] lg:text-sm'}`}>
                        <BiCategoryAlt />
                        {product?.category?.title}
                    </p>
                </div>
            </div>
            {isLargePC && <div className='px-4 py-7 hidden lg:flex gap-4 text-sm h-full'>
                <div className='w-10 h-fit'>
                    <Avatar avatar={product?.user?.avatar} />
                </div>
                <div className='flex flex-col gap-1.5'>
                    <NavLink
                        to={product?.user?.id === user?.user_id ? '/users/me' : `/users/${product?.user?.id}`}
                        className='font-bold hover:text-accent-orange flex-wrap flex'
                    >
                        {product?.user?.first_name} {product?.user?.last_name} {product?.user?.id === user?.user_id && `(${t('me')})`}
                    </NavLink>
                    <div className='flex items-center gap-1.5 flex-wrap'>
                        <RatingStars rating={product?.user?.rating} />
                        <NavLink
                            to={product?.user?.id === user?.user_id ? '/users/me/comments' : `/users/${product?.user?.id}/comments`}
                            className='text-sm hover:text-accent-orange'
                        >
                            {t('comments')} ({product?.user?.comments_count})
                        </NavLink>
                    </div>
                    <p>12 {t('items_sold')}</p>
                    {product?.user?.id !== user?.user_id && <NavLink
                        className='text-accent-orange flex items-center gap-2 h-fit'
                        to={`/users/${product?.user?.id}`}
                    >
                        <FiMail />
                        {t('send_message')}
                    </NavLink>}
                    {product?.user?.phone_verified && <p className='flex items-center gap-2 text-green-600 dark:text-green-300 dark:bg-green-800 bg-green-100 px-2 py-1 font-bold w-fit rounded-full text-sm mt-auto'>
                        <TbPhoneCheck />
                        {t('phone_verified')}
                    </p>}
                </div>
            </div>}
        </NavLink>
    )

    return (
        <NavLink
            to={`/products/${product?.slug}`}
            className={cn(
                // product.promotions.includes('xl') && 'col-span-2',
                `hover:md:bg-slate-50 hover:md:dark:bg-zinc-700 rounded-2xl md:p-5`,
                search && 'pb-5',
                `flex flex-col gap-2 transition-all duration-150 h-full`
            )}
        >
            <ImagesCarousel images={product?.images} />
            <h3 className="flex items-center gap-2">
                {product?.address?.country_code && <Flag size={5} country={product?.address?.country_code} className='mb-auto h-fit mt-[3px]' />}
                <p className={`${search ? 'font-bold text-xl' : 'text-lg my-auto'} line-clamp-2 hover:text-accent-orange w-fit justify-between`}>{product?.name}</p>
                <span className='ml-auto'>
                    {product?.is_favourited && <AiFillHeart color='red' />}
                </span>
            </h3>
            {search && product?.promotions.includes('price') ?
                <span className="before:block before:absolute before:-inset-1 before:-skew-x-[10deg] before:bg-accent-orange relative inline-block px-1 before:rounded-sm w-fit ml-1.5">
                    <span className="relative text-white"><Price
                        className='font-bolditalic leading-none text-lg lg:text-2xl'
                        price={product?.price}
                    />
                    </span>
                </span>
                :
                <Price
                    className='font-bolditalic leading-none text-md lg:text-xl'
                    price={product?.price}
                />}
            <div className='grid grid-cols-[auto_1fr] gap-y-0.5 gap-x-1.5 items-center'>
                <BiTimeFive />
                <time className='text-sm line-clamp-1'><PublishTime pubDate={product?.pub_date} /></time>
                {(!managable || (user?.user_id !== product?.user?.id)) &&
                    <>
                        <FiMapPin />
                        <p className='text-sm line-clamp-1'>{product?.address?.short} {product?.address?.city}</p>
                    </>}
                {(isMinTablet || search) &&
                    <>
                        <BiCategoryAlt />
                        <p className='text-sm line-clamp-1'>{product?.category?.title}</p>
                    </>}
            </div>
            {search && product?.promotions.includes('xl') && <div className='flex flex-col gap-0.5'>
                <NavLink
                    to={product?.user?.id === user?.user_id ? '/users/me' : `/users/${product?.user?.id}`}
                    className='font-bold hover:text-accent-orange flex items-center gap-1'
                >
                    {product?.user?.phone_verified && <p className='flex items-center gap-2 text-green-600 dark:text-green-300 dark:bg-green-800 bg-green-100 px-2 py-1 font-bold w-fit rounded-full text-sm mr-1.5'>
                        <TbPhoneCheck />
                    </p>}
                    <div className='flex flex-wrap gap-1 text-[12px] 2xl:text-sm'>
                        <p>{product?.user?.first_name}</p>
                        <p>{product?.user?.last_name}</p>
                        <p>{product?.user?.id === user?.user_id && `(${t('me')})`}</p>
                    </div>
                </NavLink>
                <div className='flex items-center gap-1.5 flex-wrap justify-between '>
                    <RatingStars rating={product?.user?.rating} />
                </div>
            </div>}
            {managable && (user?.user_id === product?.user?.id) && <div className='grid gap-2'>
                <ManageProductMenu product={product} dropdown />
            </div>}
        </NavLink>
    )
}

export default ItemCard