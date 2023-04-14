import { useContext, useEffect, useState } from "react"
import { useCategories } from "../../../api/api"
import CategoriesListStateContext from "../../../contexts/CategoriesListStateContext"
import { filterChildCategories } from "../utils"
import PrimaryCategory from "./PrimaryCategory"
import SecondaryCategoriesList from './SecondaryCategoriesList'
import Spinner from '../../ui/Spinner'

const FullCategoriesList = () => {

    const { open, setOpen } = useContext(CategoriesListStateContext)
    const { data, error, isLoading } = useCategories({ all: true })
    const [parentCategory, setParentCategory] = useState()
    const [expandedCatId, setExpandedCatId] = useState(null)

    useEffect(() => {
        return () => setOpen(false)
    }, [])

    if (isLoading) return <div className="bg-white dark:bg-zinc-800 p-5 w-full border-2 border-accent-orange rounded-xl grid grid-cols-[5fr_13fr] xl:grid-cols-[3fr_10fr]  gap-7 h-[80vh"><Spinner /></div>
    if (error) return
    if (!open) return

    return (
        <section className="bg-white dark:bg-zinc-800 p-5 w-full border-2 border-accent-orange rounded-xl grid grid-cols-[5fr_13fr] xl:grid-cols-[3fr_10fr]  gap-7 h-[80vh]" aria-label="menu with all categories to search">
            <ul className="overflow-y-auto max-h-[74vh]" aria-label="list of primary categories">
                {data.filter(el => el.parent === null).map((el, key) => <PrimaryCategory
                    key={key}
                    onChange={() => {
                        setParentCategory(el)
                        setExpandedCatId(null)
                    }}
                    category={el}
                />
                )}
            </ul>
            {parentCategory && <SecondaryCategoriesList
                expandedCatId={expandedCatId}
                setExpandedCatId={setExpandedCatId}
                data={data}
                parentCategory={parentCategory}
                childCategories={filterChildCategories(data, parentCategory?.id)}
            />}
        </section>
    )
}

export default FullCategoriesList