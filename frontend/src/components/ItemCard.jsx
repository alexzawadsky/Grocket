import { NavLink } from 'react-router-dom'
import { BiCategoryAlt, BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useMediaQuery } from 'react-responsive'
import { useFavouriteProduct } from '../api/api'
import Price from './Price'
import { useContext } from 'react'
import AuthContext from '../contexts/AuthProvider'
import PublishTime from './PublishTime'
import ImagesCarousel from './ImagesCarousel'
import ManageProductMenu from './ManageProductMenu'
import useScreen from '../hooks/useScreen'
import Avatar from './Avatar'
import RatingStars from './RatingStars'
import { FiMail } from 'react-icons/fi'
import { TbPhoneCheck } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

const ItemCard = ({ product, managable = false, search = false, horizontal }) => {

    const { isLargePC, isMinTablet } = useScreen()
    const favouriteProductMutation = useFavouriteProduct()
    const { user } = useContext(AuthContext)
    const { t } = useTranslation()

    const handleFavourite = () => favouriteProductMutation.mutate({ id: product.id, state: product.is_favourited })

    if (horizontal && isMinTablet) return (
        <NavLink className='grid grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2fr_1fr] rounded-2xl items-center overflow-hidden h-fit p-5 hover:bg-slate-50 transition-all duration-150' to={`/products/${product?.id}`}>
            <NavLink
                to={`/products/${product?.id}`}
                className='grid grid-cols-2 gap-1'
            >
                <div className="col-span-full rounded-lg overflow-hidden">
                    <ImagesCarousel images={product?.images} />
                </div>
                {product?.promotions.includes('xl') &&
                    <>
                        <img className='rounded-lg' src={product?.images[1]?.image} />
                        <img className='rounded-lg' src={product?.images[2]?.image} />
                    </>
                }
            </NavLink>
            <div className={`flex items-start h-full flex-col justify-center ${product?.promotions.includes('xl') ? 'gap-2 lg:gap-3' : 'gap-1 lg:gap-2'} p-4`}>
                <NavLink
                    className={`font-bold hover:text-accent-orange ${product?.promotions.includes('xl') ? 'text-md xl:text-2xl' : 'text-md xl:text-xl'}`}
                    to={`/products/${product.id}`}
                >
                    {product?.name}
                </NavLink>
                <p
                    className={`text-ellipsis overflow-hidden ${product?.promotions.includes('xl') ? 'text-sm lg:text-md' : 'text-sm'}`}
                    style={{
                        lineClamp: 2,
                        WebkitLineClamp: 2
                    }}
                >
                    {product?.description?.slice(0, product?.promotions?.includes('xl') ? 200 : 100)}{product?.description.length > (product?.promotions.includes('xl') ? 200 : 100) ? '...' : ''}
                </p>
                <p
                    className={
                        product?.promotions.includes('price') ?
                            'font-bolditalic rounded-lg text-lg lg:text-2xl bg-accent-orange text-white w-fit py-1 px-2 leading-none'
                            :
                            'font-bolditalic leading-none text-md lg:text-xl'
                    }
                >
                    <Price price={product?.price} currency={product?.price_currency} />
                </p>
                <div>
                    <p className={`flex items-center gap-2 ${product?.promotions.includes('xl') ? 'text-sm lg:text-md' : 'text-[12px] lg:text-sm'}`}>
                        <BiTimeFive />
                        <PublishTime pubDate={product?.pub_date} />
                    </p>
                    <p className={`flex items-center gap-2 ${product?.promotions.includes('xl') ? 'text-sm lg:text-md' : 'text-[12px] lg:text-sm'}`}>
                        <FiMapPin />
                        {product?.address}
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
                        <RatingStars rating={5} />
                        <NavLink
                            to={product?.user?.id === user?.user_id ? '/users/me/comments' : `/users/${product?.user?.id}/comments`}
                            className='text-sm hover:text-accent-orange'
                        >
                            {t('comments')} (23)
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
                    <p className='flex items-center gap-2 text-green-600 bg-green-100 px-2 py-1 font-bold w-fit rounded-full text-sm mt-auto'>
                        <TbPhoneCheck />
                        {t('phone_verified')}
                    </p>
                </div>
            </div>}
        </NavLink>
    )

    return (
        <NavLink
            to={`/products/${product?.id}`}
            className='hover:bg-slate-50 rounded-2xl md:p-5 pb-5 flex flex-col gap-2 transition-all duration-150'
        >
            <div className="rounded-lg overflow-hidden">
                <ImagesCarousel images={product?.images} />
            </div>
            <p className={`${search ? 'font-bold text-xl' : 'text-lg my-auto'} hover:text-accent-orange w-fit`}>{product?.name}</p>
            <p
                className={
                    search && product?.promotions.includes('price') ?
                        'font-bolditalic rounded-lg text-2xl bg-accent-orange text-white w-fit py-1 px-2 leading-none'
                        :
                        'font-bolditalic leading-none text-xl'
                }
            >
                <Price price={product?.price} currency={product?.price_currency} />
            </p>
            <div>
                <p className='flex items-center gap-2 text-sm'>
                    <BiTimeFive />
                    <PublishTime pubDate={product?.pub_date} />
                </p>
                {(!managable || (user?.user_id !== product?.user?.id)) &&
                    <p className='flex items-center gap-2 text-sm'>
                        <FiMapPin />
                        {product?.address}
                    </p>}
                {(isMinTablet || search) && <p className='flex items-center gap-2 text-sm'>
                    <BiCategoryAlt />
                    {product?.category?.title}
                </p>}
            </div>
            {search && product?.promotions.includes('xl') && <div className='flex flex-col gap-0.5'>
                <NavLink
                    to={product?.user?.id === user?.user_id ? '/users/me' : `/users/${product?.user?.id}`}
                    className='font-bold hover:text-accent-orange flex items-center gap-1'
                >
                    <p className='flex items-center gap-2 text-green-600 bg-green-100 px-2 py-1 font-bold w-fit rounded-full text-sm mr-1.5'>
                        <TbPhoneCheck />
                    </p>
                    <div className='flex flex-wrap gap-1 text-[12px] 2xl:text-sm'>
                        <p>{product?.user?.first_name}</p>
                        <p>{product?.user?.last_name}</p>
                        <p>{product?.user?.id === user?.user_id && `(${t('me')})`}</p>
                    </div>
                </NavLink>
                <div className='flex items-center gap-1.5 flex-wrap justify-between '>
                    <RatingStars rating={5} />
                </div>
            </div>}
            {managable && (user?.user_id === product?.user?.id) && <div className='grid gap-2'>
                <ManageProductMenu product={product} dropdown />
            </div>}
        </NavLink>
    )

    return (
        <div to={`/product/${product.id}`} className='border-black border-2 rounded-2xl overflow-hidden flex flex-col'>
            <NavLink to={`/products/${product.id}`} className="w-full">
                <ImagesCarousel images={product.images} />
            </NavLink>
            <div className='p-3 md:p-5 flex justify-around flex-col gap-2 grow'>
                <div className="flex justify-between gap-2 grow items-center">
                    <div className='overflow-hidden'>
                        <NavLink
                            to={`/products/${product.id}`}
                            className='hover:text-accent-orange text-sm xl:text-lg'
                        >
                            {product.name}
                        </NavLink>
                    </div>
                    {user?.user_id !== product?.user?.id &&
                        <button
                            onClick={handleFavourite}
                        >
                            {product.is_favourited ?
                                <AiFillHeart color='#FF1500' />
                                :
                                <AiOutlineHeart color='#FF9001' />
                            }
                        </button>
                    }
                </div>
                <p className='font-bolditalic text-md xl:text-xl leading-none'>
                    <Price price={product?.price} currency={product?.price_currency} />
                </p>
                <div className='grid gap-y-1.5 xl:gap-y-1 grid-cols-[auto_1fr] gap-x-2 items-center'>
                    {isPC ? <><BiCategoryAlt /><p className='text-[0.6rem] xl:text-sm truncate'>{product.category.title}</p></> : null}
                    {(!managable || (user?.user_id !== product?.user?.id)) &&
                        <>
                            <FiMapPin />
                            <div className="overflow-hidden">
                                <p className='text-[0.6rem] xl:text-sm truncate'>{product.address}</p>
                            </div>
                        </>}
                    <BiTimeFive />
                    <p className='text-[0.6rem] xl:text-sm'>
                        <PublishTime pubDate={product?.pub_date} />
                    </p>
                </div>

            </div>
        </div>
    )
}

export default ItemCard