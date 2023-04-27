import { useContext } from "react"
import { Link } from "react-router-dom"
import CategoriesListStateContext from "../../../contexts/CategoriesListStateContext"

const CategoryLink = ({ category, children, key }) => {

    const { setOpen } = useContext(CategoriesListStateContext)

    return (
        <Link
            key={key}
            className='w-fit block'
            to={`/search?category_id=${category?.id}`}
            onClick={() => setOpen(false)}
        >
            {children}
        </Link>
    )
}

export default CategoryLink