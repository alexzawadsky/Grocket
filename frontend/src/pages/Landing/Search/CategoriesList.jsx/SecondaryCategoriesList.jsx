import CategoryLink from "./CategoryLink"
import ThirdLevelCategoriesList from "./ThirdLevelCategoriesList"
import { filterChildCategories } from "./utils"

const ChildCategoriesList = ({ data, parentCategory, childCategories, expandedCatId, setExpandedCatId }) => {
    return (
        <div className="h-[80vh] max-h-[80vh]">
            <CategoryLink id={parentCategory?.id}>
                <h2 className="font-bold text-3xl pb-5 items-center gap-2 hover:gap-3 transition-all hover w-fit hover:text-accent-orange block">
                    {parentCategory?.title}
                </h2>
            </CategoryLink>
            <div className="flex flex-wrap flex-col h-[67vh] max-h-[67vh] gap-y-3 gap-x-7 max-w-full overflow-x-auto overflow-y-auto">
                {childCategories && childCategories.map((el, key) =>
                    <ThirdLevelCategoriesList
                        key={key}
                        parentCategory={el}
                        categoriesList={filterChildCategories(data, el?.id)}
                        expandedCatId={expandedCatId}
                        setExpandedCatId={setExpandedCatId}
                    />)}
            </div>
        </div>
    )
}

export default ChildCategoriesList