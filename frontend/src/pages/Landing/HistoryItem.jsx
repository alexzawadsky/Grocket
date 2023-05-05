import { Link } from 'react-router-dom'
import { Price } from '../../components/ui'

const HistoryItem = ({ product }) => {
    return (
        <li>
            <Link
                to={`/products/${product.slug}`}
                className="flex w-full items-center gap-5 rounded-xl px-3 py-3 transition-all duration-150 hover:bg-slate-50 hover:dark:bg-zinc-700"
            >
                <img
                    src={product?.images[0]?.image}
                    className="w-1/4 rounded-md"
                />
                <div>
                    <p className="line-clamp-1 text-sm hover:text-accent-orange xl:text-lg">
                        {product?.name}
                    </p>
                    <p className="font-bold">
                        <Price
                            price={product?.price}
                            currency={product?.price_currency}
                        />
                    </p>
                </div>
            </Link>
        </li>
    )
}

export default HistoryItem
