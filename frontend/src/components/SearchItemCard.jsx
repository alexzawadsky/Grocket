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

const SearchItemCard = ({ product }) => {

    const { user } = useContext(AuthContext)

    return (
        <NavLink className='grid grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2fr_1fr] rounded-2xl items-center overflow-hidden h-fit p-5 hover:bg-slate-50' to={`/products/${product?.id}`}>
            <NavLink
                to={`/products/${product?.id}`}
                className='grid grid-cols-2 gap-1'
            >
                <div className="col-span-full rounded-lg overflow-hidden">
                    <ImagesCarousel images={product.images} />
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
                    {product?.description.slice(0, product?.promotions.includes('xl') ? 200 : 100)}{product?.description.length > (product?.promotions.includes('xl') ? 200 : 100) ? '...' : ''}
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
                        to={product?.user?.id === user?.user_id ? '/profile' : `/users/${product?.user?.id}`}
                        className='font-bold hover:text-accent-orange flex-wrap flex'
                    >
                        {product?.user?.first_name} {product?.user?.last_name} {product?.user?.id === user?.user_id && '(me)'}
                    </NavLink>
                    <div className='flex items-center gap-2'>
                        <RatingStars rating={5} />
                        <NavLink
                            to={product?.user?.id === user?.user_id ? '/profile/comments' : `/users/${product?.user?.id}/comments`}
                            className='text-sm hover:text-accent-orange'
                        >
                            23 comments
                        </NavLink>
                    </div>
                    <p>12 items sold</p>
                    {product?.user?.id !== user?.user_id && <NavLink
                        className='text-accent-orange flex items-center gap-2 h-fit'
                        to={`/users/${product?.user?.id}`}
                    >
                        <FiMail />
                        Send message
                    </NavLink>}
                    <p className='flex items-center gap-2 text-green-600 bg-green-100 px-2 py-1 font-bold w-fit rounded-full text-sm mt-auto'>
                        <TbPhoneCheck />
                        Phone verified
                    </p>
                </div>
            </div>
        </NavLink>
    )
}

export default SearchItemCard