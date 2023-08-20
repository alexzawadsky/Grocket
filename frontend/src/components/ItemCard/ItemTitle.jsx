import useScreen from '../../hooks/useScreen'
import { Flag } from '../ui'
import ItemTitleIcon from './ItemTitleIcon'
import cn from 'classnames'

const ItemTitle = ({ product, search, managable }) => {
    const { isMinTablet } = useScreen()
    return (
        <div className="flex w-full items-center gap-2">
            <Flag
                width={isMinTablet || search ? 20 : 15}
                country={product?.address?.country_code}
            />
            <p
                className={cn(
                    `line-clamp-2 hover:text-accent-orange`,
                    search ? 'font-bold' : '',
                    search
                        ? product?.promotions.includes('xl')
                            ? 'text-xl xl:text-2xl'
                            : 'text-md xl:text-xl'
                        : 'text-md md:text-lg'
                )}
            >
                {product?.name}
            </p>
            <ItemTitleIcon product={product} managable={managable} />
        </div>
    )
}

export default ItemTitle
