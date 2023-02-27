import { BsArrowRight } from "react-icons/bs"

const Category = ({ category }) => {
    return (
        <div className="flex gap-3 md:gap-5 flex-wrap items-center">
            {category.parents.map((el, key) => (
                <>
                    <p key={key}>{el.title}</p>
                    <BsArrowRight />
                </>
            ))}
            <p className='font-bold'>{category.title}</p>
        </div>
    )
}

export default Category