import { useContext } from "react"
import { NavLink } from "react-router-dom"
import CategoriesListStateContext from "../../../contexts/CategoriesListStateContext"

const CategoryLink = ({ id, children }) => {

    const { setOpen } = useContext(CategoriesListStateContext)

    return (
        <NavLink
            className='w-fit block'
            to={`/search?category_id=${id}`}
            onClick={() => setOpen(false)}
        >
            {children}
        </NavLink>
    )
}

export default CategoryLink