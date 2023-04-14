import { useTranslation } from "react-i18next"
import CategoryLink from "./CategoryLink"
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const ThirdLevelCategoriesList = ({ first, parentCategory, categoriesList, expandedCatId, setExpandedCatId }) => {

    const { t } = useTranslation()

    if (!first && expandedCatId === parentCategory.id) return

    return (
        <>
            <CategoryLink id={parentCategory?.id}>
                <h3 className="font-bold gap-1 hover:gap-2 transition-all text-lg items-center pb-2 w-fit hover:text-accent-orange">{parentCategory?.title}</h3>
            </CategoryLink>
            <ul className="grid gap-1" aria-label="third level categories list">
                {(!expandedCatId || expandedCatId === parentCategory?.id) &&
                    <>
                        {categoriesList.slice(0, expandedCatId === parentCategory?.id ?
                            categoriesList.length : 5).map((c, key) => <li>
                                <CategoryLink
                                    key={key}
                                    id={c?.id}
                                >
                                    <p className='hover:text-accent-orange w-fit'>{c?.title}</p>
                                </CategoryLink>
                            </li>)}
                        {categoriesList.length > 5 && expandedCatId !== parentCategory?.id &&
                            <button
                                onClick={() => setExpandedCatId(parentCategory?.id)}
                                className='w-fit font-bolditalic hover:text-accent-orange  flex items-center gap-2 text-sm mt-1'
                            >
                                {t('more')}<IoIosArrowDown />
                            </button>}
                        {expandedCatId === parentCategory?.id &&
                            <button
                                onClick={() => setExpandedCatId(null)}
                                className='w-fit font-bolditalic hover:text-accent-orange flex items-center gap-2 text-sm mt-1'
                            >
                                {t('less')}<IoIosArrowUp />
                            </button>}
                    </>}
            </ul>
        </>
    )
}

export default ThirdLevelCategoriesList