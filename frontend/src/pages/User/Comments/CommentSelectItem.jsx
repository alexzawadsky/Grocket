import { Price } from '../../../components/ui'

const CommentSelectItem = ({ item, onClick, selectable }) => {
    return (
        <div
            className={`rounded-2xl border p-3 shadow-sm dark:border-2 dark:border-zinc-600 ${
                selectable &&
                'cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-700'
            } flex items-center gap-4 `}
            onClick={onClick}
        >
            <img src={item?.images[0]?.image} className="w-14 rounded-lg" />
            <p className="flex items-center gap-1">
                {item?.name.split(0, 20)}
                {item?.name.length >= 20 && '...'} -{' '}
                <span className="font-bold">
                    <Price
                        price={item?.price}
                        currency={item?.price_currency}
                    />
                </span>
            </p>
        </div>
    )
}

export default CommentSelectItem
