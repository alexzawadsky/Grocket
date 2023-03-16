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

const ItemCard = ({ product, managable }) => {

    const isPC = useMediaQuery({ query: '(min-width: 1024px)' })
    const favouriteProductMutation = useFavouriteProduct()
    const { user } = useContext(AuthContext)

    const handleFavourite = () => favouriteProductMutation.mutate({ id: product.id, state: product.is_favourited })

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
                    {user?.user_id !== product?.user &&
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
                    {(!managable || (user?.user_id !== product?.user)) &&
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
                {managable && (user?.user_id === product?.user) && <div className='grid gap-2'>
                    <ManageProductMenu product={product} dropdown />
                </div>}
            </div>
        </div>
    )
}

export default ItemCard