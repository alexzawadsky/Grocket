import { Link } from "react-router-dom"
import { Price } from "../../components/ui"

const HistoryItem = ({ product }) => {
    return (
        <li>
            <Link
                to={`/products/${product.slug}`}
                className='hover:bg-slate-50 hover:dark:bg-zinc-700 px-3 py-3 rounded-xl flex gap-5 items-center w-full transition-all duration-150'
            >
                <img src={product?.images[0]?.image} className='w-1/4 rounded-md' />
                <div>
                    <p className='text-sm xl:text-lg hover:text-accent-orange overflow-hidden truncate'>{product?.name}</p>
                    <p className='font-bold'>
                        <Price price={product?.price} currency={product?.price_currency} />
                    </p>
                </div>
            </Link>
        </li>
    )
}

export default HistoryItem