import { BsArrowRight } from "react-icons/bs"
import { NavLink } from "react-router-dom"

const Category = ({ category }) => {
    return (
        <ul className="flex gap-3 md:gap-5 flex-wrap items-center" aria-label='list of product categories'>
            {category.parents.map((el, key) => <li key={key} className="flex gap-3 md:gap-5 items-center">
                <NavLink
                    to={`/search?category_id=${el?.id}`}
                    className='hover:text-accent-orange'
                >
                    {el.title}
                </NavLink>
                <BsArrowRight />
            </li>)}
            <li>
                <NavLink
                    to={`/search?category_id=${category?.id}`}
                    className='font-bold hover:text-accent-orange'
                >
                    {category.title}
                </NavLink></li>
        </ul >
    )
}

export default Category