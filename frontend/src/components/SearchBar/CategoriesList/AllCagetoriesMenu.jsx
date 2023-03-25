import { useContext, useEffect, useState } from "react"
import { useCategories } from "../../../api/api"
import CategoriesListStateContext from "../../../contexts/CategoriesListStateContext"
import { filterChildCategories } from "../utils"
import PrimaryCategory from "./PrimaryCategory"
import SecondaryCategoriesList from './SecondaryCategoriesList'

const FullCategoriesList = () => {

    const { open, setOpen } = useContext(CategoriesListStateContext)
    const { data, error, isLoading } = useCategories({ all: true })
    const [parentCategory, setParentCategory] = useState()
    const [expandedCatId, setExpandedCatId] = useState(null)

    useEffect(() => {
        return () => setOpen(false)
    }, [])

    if (isLoading) return
    if (error) return error.message

    if (!open) return

    return (
        <div className="bg-white p-5 w-full border-2 border-accent-orange rounded-xl grid grid-cols-[5fr_13fr] xl:grid-cols-[3fr_10fr]  gap-7 h-[80vh]">
            <div className="overflow-y-auto max-h-[74vh]">
                {data.filter(el => el.parent === null).map((el, key) =>
                    <PrimaryCategory
                        key={key}
                        onChange={() => {
                            setParentCategory(el)
                            setExpandedCatId(null)
                        }}
                        category={el}
                    />)}
            </div>
            <SecondaryCategoriesList
                expandedCatId={expandedCatId}
                setExpandedCatId={setExpandedCatId}
                data={data}
                parentCategory={parentCategory}
                childCategories={filterChildCategories(data, parentCategory?.id)}
            />
        </div>
    )
}

export default FullCategoriesList