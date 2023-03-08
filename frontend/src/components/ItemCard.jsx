import { NavLink } from 'react-router-dom'
import { BiCategoryAlt, BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useMediaQuery } from 'react-responsive'
import { useFavouriteProduct } from '../api/api'
import { alertErr } from '../utils'

const ItemCard = ({ product }) => {

    const isPC = useMediaQuery({ query: '(min-width: 1024px)' })
    const favouriteProductMutation = useFavouriteProduct()

    // if (favouriteProductMutation.error) {
    //     alertErr(favouriteProductMutation.error)
    //     return
    // }

    return (
        <div to={`/product/${product.id}`} className='border-black border-2 rounded-2xl overflow-hidden flex flex-col'>
            <NavLink to={`/products/${product.id}`} className="w-full">
                {product.images ? <img src={product?.images[0]?.image} className='w-full' /> : null}
            </NavLink>
            <div className='p-3 md:p-5 flex justify-around flex-col gap-2 grow'>
                <div className="flex justify-between gap-2 grow items-center">
                    <div className='overflow-hidden'>
                        <NavLink to={`/products/${product.id}`} className='hover:text-accent-orange text-sm xl:text-lg'>{product.name}</NavLink>
                    </div>
                    <button onClick={() => favouriteProductMutation.mutate({ id: product.id, state: product.is_favourited })}>{product.is_favourited ? <AiFillHeart color='#FF1500' /> : <AiOutlineHeart color='#FF9001' />}</button>
                </div>
                <p className='font-bolditalic text-md xl:text-xl leading-none'>{parseFloat(product.price).toFixed(0)} {product.price_currency}</p>
                <div className='grid gap-y-1.5 xl:gap-y-1 grid-cols-[auto_1fr] gap-x-2 items-center'>
                    {isPC ? <><BiCategoryAlt /><p className='text-[0.6rem] xl:text-sm truncate'>{product.category.title}</p></> : null}
                    <FiMapPin />
                    <div className="overflow-hidden">
                        <p className='text-[0.6rem] xl:text-sm truncate'>{product.address}</p>
                    </div>
                    <BiTimeFive />
                    <p className='flex items-center gap-2 text-[0.6rem] xl:text-sm'>
                        {new Date(product.pub_date).toLocaleDateString(undefined,
                            { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ItemCard