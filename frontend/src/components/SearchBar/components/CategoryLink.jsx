import { useContext } from 'react'
import { Link } from 'react-router-dom'
import CategoriesListStateContext from '../../../contexts/CategoriesListStateContext'

const CategoryLink = ({ category, children, key }) => {
    const { setOpen } = useContext(CategoriesListStateContext)

    return (
        <Link
            key={key}
            className="block w-fit"
            to={`/search?category_id=${category?.id}`}
            onClick={() => setOpen(false)}
        >
            {children}
        </Link>
    )
}

export default CategoryLink
