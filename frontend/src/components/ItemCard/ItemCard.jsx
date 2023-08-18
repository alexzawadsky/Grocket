import { Link } from 'react-router-dom'
import ManageProductMenu from '../ManageProductMenu/ManageProductMenu'
import useScreen from '../../hooks/useScreen'
import cn from 'classnames'
import ItemDetails from './ItemDetails'
import ItemPrice from './ItemPrice'
import ItemDescription from './ItemDescription'
import ItemImages from './ItemImages'
import ItemUserDetails from './ItemUserDetails'
import ItemTitle from './ItemTitle'

const ItemCard = ({
    product,
    managable = false,
    search = false,
    horizontal,
}) => {
    const { isLargePC } = useScreen()

    return (
        <Link
            className={cn(
                horizontal
                    ? 'md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2fr_1fr]'
                    : 'md:gap-2',
                'grid h-full content-start items-center overflow-hidden rounded-lg transition-all duration-150 max-md:gap-2 md:rounded-2xl md:p-5 md:hover:bg-slate-50 md:hover:dark:bg-zinc-700'
            )}
            to={`/products/${product?.slug}`}
        >
            <ItemImages
                product={product}
                search={search}
                horizontal={horizontal}
            />
            <div
                className={cn(
                    'flex h-full flex-col items-start justify-center',
                    search && product?.promotions.includes('xl')
                        ? 'gap-3'
                        : 'gap-2',
                    horizontal ? 'md:px-4' : ''
                )}
            >
                <ItemTitle product={product} search={search} />
                <ItemDescription
                    product={product}
                    search={search}
                    horizontal={horizontal}
                />
                <ItemPrice product={product} search={search} />
                <ItemDetails
                    product={product}
                    search={search}
                    managable={managable}
                />
            </div>
            {managable ? (
                <ManageProductMenu
                    product={product}
                    dropdown={!horizontal || !isLargePC}
                    className="md:max-xl:mt-3"
                />
            ) : (
                <ItemUserDetails
                    search={search}
                    product={product}
                    horizontal={horizontal}
                />
            )}
        </Link>
    )
}

export default ItemCard
