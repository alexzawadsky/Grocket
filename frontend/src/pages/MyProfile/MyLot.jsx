import { NavLink } from 'react-router-dom'
import { BiCategoryAlt, BiTimeFive } from 'react-icons/bi'
import ManageProductMenu from '../../components/ManageProductMenu'

const MyLot = ({ product }) => {
    return (
        <div
            to={`/product/${product.id}`}
            className='border-black border-2 rounded-2xl flex flex-col overflow-hidden'
        >
            <NavLink
                to={`/products/${product.id}`}
                className="overflow-hidden w-full"
            >
                {product.images ? <img src={product.images[0].image} className='w-full' /> : null}
            </NavLink>
            <div
                className='p-3 md:p-5 flex justify-around flex-col gap-2 grow'
            >
                <NavLink
                    to={`/products/${product.id}`}
                    className='hover:text-accent-orange text-sm xl:text-lg'
                >
                    {product.name}
                </NavLink>
                <p
                    className='font-bolditalic text-md xl:text-xl leading-none'>
                    {parseFloat(product.price).toFixed(0)} {product.price_currency}
                </p>
                <div
                    className='grid gap-y-1.5 xl:gap-y-1 grid-cols-[auto_1fr] gap-x-2 items-center'
                >
                    <BiCategoryAlt />
                    <p
                        className='text-[0.6rem] xl:text-sm truncate'
                    >
                        {product.category.title}
                    </p>
                    <BiTimeFive />
                    <p
                        className='flex items-center gap-2 text-[0.6rem] xl:text-sm'
                    >
                        {new Date(product.pub_date).toLocaleDateString(undefined,
                            { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
                        )}
                    </p>
                </div>
            </div>
            <div className='grid gap-2 pt-0 p-5'>
                <ManageProductMenu product={product} dropdown />
            </div>
        </div>
    )
}

export default MyLot