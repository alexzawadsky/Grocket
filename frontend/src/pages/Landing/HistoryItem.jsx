import { NavLink } from "react-router-dom"
import { Price } from "../../components"

const HistoryItem = ({ content }) => {
    return (
        <NavLink to={`/products/${content.id}`} className='border-2 border-black rounded-lg p-5 flex gap-5 items-center shadow-lg w-full'>
            <img src={content?.images.filter(el => el?.is_main)[0]?.image} className='w-1/4 rounded-lg' />
            <div>
                <p className='text-sm xl:text-lg hover:text-accent-orange overflow-hidden truncate'>{content?.name}</p>
                <p className='font-bold'><Price price={content?.price} currency={content?.price_currency} /></p>
            </div>
        </NavLink>
    )
}

export default HistoryItem