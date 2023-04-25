import { useContext, useEffect, useState } from "react"
import { useCategories } from "../../../api/api"
import CategoriesListStateContext from "../../../contexts/CategoriesListStateContext"
import { filterChildCategories } from "../utils"
import PrimaryCategory from "./PrimaryCategory"
import SecondaryCategoriesList from './SecondaryCategoriesList'
import Spinner from '../../ui/Spinner'
import useScreen from "../../../hooks/useScreen"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { Button } from "../../ui"
import { useTranslation } from "react-i18next"
import cn from 'classnames'
import CategoryLink from "./CategoryLink"

const FullCategoriesList = () => {

    const { t } = useTranslation()
    const { open, setOpen } = useContext(CategoriesListStateContext)
    const { isMinTablet } = useScreen()
    const [categoryPath, setCategoryPath] = useState([])
    const { data, error, isLoading } = useCategories(isMinTablet ?
        { all: true } : { parent_id: categoryPath.slice(-1)[0]?.id }
    )
    const [parentCategory, setParentCategory] = useState({ id: -1 })

    useEffect(() => {
        return () => setOpen(false)
    }, [])

    if (error) return
    if (!open) return

    return (
        <section className="bg-white dark:bg-zinc-800 pb-5 pt-2 px-5 md:p-5 md:pr-7 w-full border-2 border-accent-orange rounded-xl grid md:grid-cols-[5fr_13fr] xl:grid-cols-[3fr_10fr] gap-3 md:gap-7 min-h-[calc(100vh-212px)] max-h-[calc(100vh-212px)] md:min-h-[calc(100vh-80px-40px-40px)] md:max-h-[calc(100vh-80px-40px-40px)] mb-5" aria-label="menu with all categories to search">
            {isMinTablet ? <>
                <ul
                    className={cn(
                        "overflow-y-auto max-h-[calc(100vh-80px-40px-40px-40px)]",
                        isLoading && 'grid gap-3 h-fit !overflow-hidden'
                    )}
                    aria-label="list of primary categories"
                >
                    {isLoading && <Spinner type='category' count={20} />}
                    {data && data.filter(el => el.parent === null).map((el, key) => <PrimaryCategory
                        key={key}
                        onChange={() => setParentCategory(el)}
                        category={el}
                    />)}
                </ul>
                <SecondaryCategoriesList parentCategory={parentCategory} />
            </> : <div className="max-h-full">
                <div className={cn(
                    categoryPath.length > 0 && 'grid-cols-[1fr_auto_1fr]',
                    "grid w-full gap-5",
                )}>
                    {categoryPath.length > 0 && <Button
                        border={false}
                        className='text-lg'
                        width='fit'
                        onClick={() =>
                            setCategoryPath(prevState => prevState.slice(0, prevState.length - 1))
                        }
                    >
                        <IoIosArrowBack />
                    </Button>}
                    <p className="mx-auto font-bold text-lg line-clamp-1">
                        {categoryPath.slice(-1)[0]?.title || t('category')}
                    </p>
                </div>
                <ul className="grid gap-3 overflow-y-auto max-h-[calc(100vh-212px-60px)] mt-2">
                    {isLoading && <Spinner type='category' count={7} />}
                    {(data && !isLoading) && data.map((el, key) => <li key={key} >
                        {!el?.is_lower ? <Button
                            border={false}
                            bold={false}
                            width='full'
                            to={el?.is_lower && `/search?category_id=${el?.id}`}
                            onClick={() => setCategoryPath(prevState => [...prevState, el])}
                        >
                            <p className="mr-auto">{el?.title}</p>
                            {!el?.is_lower && <IoIosArrowForward />}
                        </Button> :
                            <CategoryLink category={el}>
                                {el?.title}
                            </CategoryLink>}
                    </li>)}
                </ul>
            </div>}
        </section>
    )
}

export default FullCategoriesList