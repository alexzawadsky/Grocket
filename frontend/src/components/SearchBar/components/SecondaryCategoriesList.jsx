import CategoryLink from "./CategoryLink"
import ThirdLevelCategoriesList from "./ThirdCategoriesList"
import { filterChildCategories } from "../utils"

const ChildCategoriesList = ({ data, parentCategory, childCategories, expandedCatId, setExpandedCatId }) => {
    return (
        <div className="h-full overflow-y-auto">
            <CategoryLink category={parentCategory}>
                <h2 className="font-bold text-3xl pb-5 items-center gap-2 hover:gap-3 transition-all hover w-fit hover:text-accent-orange block">
                    {parentCategory?.title}
                </h2>
            </CategoryLink>
            <ul className="flex flex-wrap flex-col max-h-[calc(100%-36px)] h-[calc(100%-56px)] gap-y-3 gap-x-7 max-w-full overflow-x-auto" aria-label='second level categories list'>
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