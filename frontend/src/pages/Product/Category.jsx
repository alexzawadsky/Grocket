import { BsArrowRight } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'

const Category = ({ category }) => {
    return (
        <ul
            className="flex flex-wrap items-center gap-x-3 gap-y-1 md:gap-5"
            aria-label="list of product categories"
        >
            {category.parents.map((el, key) => (
                <li key={key} className="flex items-center gap-3 md:gap-5">
                    <NavLink
                        to={`/search?category_id=${el?.id}`}
                        className="hover:text-accent-orange"
                    >
                        {el.title}
                    </NavLink>
                    <BsArrowRight />
                </li>
            ))}
            <li>
                <NavLink
                    to={`/search?category_id=${category?.id}`}
                    className="font-bold hover:text-accent-orange"
                >
                    {category.title}
                </NavLink>
            </li>
        </ul>
    )
}

export default Category
