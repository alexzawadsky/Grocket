import CategoryLink from "./CategoryLink"
import ThirdLevelCategoriesList from "./ThirdCategoriesList"
import { filterChildCategories } from "../utils"
import { useCategories } from "../../../api/api"
import { useMemo, useState } from "react"
import { Spinner } from "../../ui"
import cn from 'classnames'

const ChildCategoriesList = ({ parentCategory }) => {

    const { isLoading, data } = useCategories({ all: true })
    const [expandedCatId, setExpandedCatId] = useState(null)
    const childCategories = useMemo(() => filterChildCategories(data, parentCategory?.id),
        [data, parentCategory?.id])

    if (!parentCategory?.id) return

    return (
        <div className="h-full overflow-y-auto">
            {!isLoading ? <CategoryLink category={parentCategory}>
                <h2 className="font-bold text-3xl pb-5 items-center gap-2 hover:gap-3 transition-all hover w-fit hover:text-accent-orange block">
                    {parentCategory?.title}
                </h2>
            </CategoryLink> : <p className="h-12 w-56 bg-slate-100 dark:bg-zinc-700 animate-pulse duration-75"></p>}
            <ul
                className={cn(
                    "flex flex-wrap flex-col max-h-[calc(100vh-80px-40px-40px-40px-56px)] h-[calc(100%-56px)] gap-y-3 gap-x-7 max-w-full overflow-x-auto",
                    isLoading && '!overflow-x-hidden pt-5 !gap-5'
                )}
                aria-label='second level categories list'
            >
                {isLoading && Array(12).fill(0).map((_, key) =>
                    <Spinner type='catlist' />)}
                {expandedCatId &&
                    <li><ThirdLevelCategoriesList
                        parentCategory={data.find(el => el.id === expandedCatId)}
                        categoriesList={filterChildCategories(data, data.find(el => el.id === expandedCatId).id)}
                        expandedCatId={expandedCatId}
                        setExpandedCatId={setExpandedCatId}
                        first
                    /></li>}
                {childCategories && childCategories.map((el, key) => <li className="max-w-[35%] lg:max-w-[30%] xl:max-w-[20%]">
                    <ThirdLevelCategoriesList
                        key={key}
                        parentCategory={el}
                        categoriesList={filterChildCategories(data, el?.id)}
                        expandedCatId={expandedCatId}
                        setExpandedCatId={setExpandedCatId}
                    />
                </li>)}
            </ul>
        </div>
    )
}

export default ChildCategoriesList