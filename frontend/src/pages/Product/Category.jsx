import { BsArrowRight } from "react-icons/bs"

const Category = ({ category }) => {
    return (
        <ul className="flex gap-3 md:gap-5 flex-wrap items-center" aria-label='list of product categories'>
            {category.parents.map((el, key) => (
                <li className="flex gap-3 md:gap-5 items-center" key={key}>
                    {el.title}<BsArrowRight />
                </li>
            ))}
            <li className='font-bold'>{category.title}</li>
        </ul>
    )
}

export default Category