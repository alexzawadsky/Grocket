import { useContext } from "react"
import { NavLink } from "react-router-dom"
import CategoriesListStateContext from "../../../contexts/CategoriesListStateContext"

const CategoryLink = ({ category, children, key }) => {

    const { setOpen } = useContext(CategoriesListStateContext)
    //&category_name=${category?.title}
    return (
        <NavLink
            key={key}
            className='w-fit block'
            to={`/search?category_id=${category?.id}`}
            onClick={() => setOpen(false)}
        >
            {children}
        </NavLink>
    )
}

export default CategoryLink