import { Price } from "../../../components/ui"

const CommentSelectItem = ({ item, onClick, selectable }) => {
    return (
        <div
            className={`rounded-2xl p-3 border shadow-sm ${selectable && 'cursor-pointer hover:bg-slate-100'} flex items-center gap-4`}
            onClick={onClick}
        >
            <img
                src={item?.images[0]?.image}
                className='w-14 rounded-lg'
            />
            <p>
                {item?.name} - <strong><Price price={item?.price} currency={item?.price_currency} /></strong>
            </p>
        </div>
    )
}

export default CommentSelectItem