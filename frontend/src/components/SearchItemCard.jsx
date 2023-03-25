import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import Price from './Price'
import PublishTime from './PublishTime'
import { BiCategoryAlt, BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import Avatar from './Avatar'
import RatingStars from './RatingStars'
import { TbPhoneCheck } from 'react-icons/tb'
import AuthContext from '../contexts/AuthProvider'
import { FiMail } from 'react-icons/fi'
import ImagesCarousel from './ImagesCarousel'
import { useTranslation } from 'react-i18next'
import useScreen from '../hooks/useScreen'

const SearchItemCard = ({ product, isCard }) => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const { isMinTablet } = useScreen()

    if (isCard || !isMinTablet) return (
        <NavLink
            to={`/products/${product?.id}`}
            className='hover:bg-slate-50 rounded-2xl md:p-5 pb-5 grid gap-2 h-fit'
        >
            <div className="rounded-lg overflow-hidden">
                <ImagesCarousel images={product?.images} />
            </div>
            <p className='font-bold text-xl hover:text-accent-orange w-fit'>{product?.name}</p>
            <p
                className={
                    product?.promotions.includes('price') ?
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
                <p className='flex items-center gap-2 text-sm'>
                    <FiMapPin />
                    {product?.address}
                </p>
                <p className='flex items-center gap-2 text-sm'>
                    <BiCategoryAlt />
                    {product?.category?.title}
                </p>
            </div>
            {product?.promotions.includes('xl') && <div className='flex flex-col gap-0.5'>
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
        </NavLink>
    )

    return (
        <NavLink className='grid grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2fr_1fr] rounded-2xl items-center overflow-hidden h-fit p-5 hover:bg-slate-50 transition-all duration-150' to={`/products/${product?.id}`}>
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
            <div className={`flex items-start h-full flex-col justify-center ${product?.promotions.includes('xl') ? 'gap-3' : 'gap-2'} p-4`}>
                <NavLink
                    className={`font-bold hover:text-accent-orange ${product?.promotions.includes('xl') ? 'text-md xl:text-2xl' : 'text-md xl:text-xl'}`}
                    to={`/products/${product.id}`}
                >
                    {product?.name}
                </NavLink>
                <p
                    className={`text-ellipsis overflow-hidden ${product?.promotions.includes('xl') ? '' : 'text-sm'}`}
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
                            'font-bolditalic rounded-lg text-2xl bg-accent-orange text-white w-fit py-1 px-2 leading-none'
                            :
                            'font-bolditalic leading-none text-xl'
                    }
                >
                    <Price price={product?.price} currency={product?.price_currency} />
                </p>
                <div>
                    <p className={`flex items-center gap-2 ${product?.promotions.includes('xl') ? '' : 'text-sm'}`}>
                        <BiTimeFive />
                        <PublishTime pubDate={product?.pub_date} />
                    </p>
                    <p className={`flex items-center gap-2 ${product?.promotions.includes('xl') ? '' : 'text-sm'}`}>
                        <FiMapPin />
                        {product?.address}
                    </p>
                    <p className={`flex items-center gap-2 ${product?.promotions.includes('xl') ? '' : 'text-sm'}`}>
                        <BiCategoryAlt />
                        {product?.category?.title}
                    </p>
                </div>
            </div>
            <div className='px-4 py-7 hidden lg:flex gap-4 text-sm h-full'>
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
                    <p>{product?.user?.sold_count} {t('items_sold')}</p>
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
            </div>
        </NavLink>
    )
}

export default SearchItemCard