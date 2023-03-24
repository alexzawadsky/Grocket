import { NavLink } from "react-router-dom"
import { Price } from "../../components"

const HistoryItem = ({ content }) => {
    return (
        <NavLink
            to={`/products/${content.id}`}
            className='hover:bg-slate-50 px-3 py-3 rounded-xl flex gap-5 items-center w-full transition-all duration-150'
        >
            <img src={content?.images.filter(el => el?.is_main)[0]?.image} className='w-1/4 rounded-md' />
            <div>
                <p className='text-sm xl:text-lg hover:text-accent-orange overflow-hidden truncate'>{content?.name}</p>
                <p className='font-bold'><Price price={content?.price} currency={content?.price_currency} /></p>
            </div>
        </NavLink>
    )
}

export default HistoryItem