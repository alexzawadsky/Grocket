import { useTranslation } from "react-i18next"
import CategoryLink from "./CategoryLink"
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const ThirdLevelCategoriesList = ({ parentCategory, categoriesList, expandedCatId, setExpandedCatId }) => {

    const { t } = useTranslation()

    return (
        <div className='max-w-[35%] lg:max-w-[30%] xl:max-w-[20%]'>
            <CategoryLink id={parentCategory?.id}>
                <h3 className="font-bold gap-1 hover:gap-2 transition-all text-lg items-center pb-2 w-fit hover:text-accent-orange">{parentCategory?.title}</h3>
            </CategoryLink>
            <div className="grid gap-1">
                {(!expandedCatId || expandedCatId === parentCategory?.id) &&
                    <>
                        {categoriesList.slice(0, expandedCatId === parentCategory?.id ?
                            categoriesList.length : 5).map((c, key) =>
                                <CategoryLink
                                    key={key}
                                    id={c?.id}
                                >
                                    <p className='hover:text-accent-orange w-fit'>{c?.title}</p>
                                </CategoryLink>)}
                        {categoriesList.length > 5 && expandedCatId !== parentCategory?.id &&
                            <button
                                onClick={() => setExpandedCatId(parentCategory?.id)}
                                className='w-fit hover:text-accent-orange  flex items-center gap-2 text-sm mt-1'
                            >
                                {t('more')}<IoIosArrowDown />
                            </button>}
                        {expandedCatId === parentCategory?.id &&
                            <button
                                onClick={() => setExpandedCatId(null)}
                                className='w-fit hover:text-accent-orange flex items-center gap-2 text-sm mt-1'
                            >
                                {t('less')}<IoIosArrowUp />
                            </button>}
                    </>}
            </div>
        </div>
    )
}

export default ThirdLevelCategoriesList