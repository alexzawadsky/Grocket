import { useTranslation } from 'react-i18next'
import CategoryLink from './CategoryLink'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const ThirdLevelCategoriesList = ({
    first,
    parentCategory,
    categoriesList,
    expandedCatId,
    setExpandedCatId,
}) => {
    const { t } = useTranslation()

    if (!first && expandedCatId === parentCategory.id) return

    return (
        <>
            <CategoryLink category={parentCategory}>
                <h3 className="w-fit items-center gap-1 pb-2 text-lg font-bold transition-all hover:gap-2 hover:text-accent-orange">
                    {parentCategory?.title}
                </h3>
            </CategoryLink>
            <ul className="grid gap-1" aria-label="third level categories list">
                {(!expandedCatId || expandedCatId === parentCategory?.id) && (
                    <>
                        {categoriesList
                            .slice(
                                0,
                                expandedCatId === parentCategory?.id
                                    ? categoriesList.length
                                    : 5
                            )
                            .map((c, key) => (
                                <li>
                                    <CategoryLink key={key} category={c}>
                                        <p className="w-fit hover:text-accent-orange">
                                            {c?.title}
                                        </p>
                                    </CategoryLink>
                                </li>
                            ))}
                        {categoriesList.length > 5 &&
                            expandedCatId !== parentCategory?.id && (
                                <button
                                    onClick={() =>
                                        setExpandedCatId(parentCategory?.id)
                                    }
                                    className="mt-1 flex w-fit  items-center gap-2 font-bolditalic text-sm hover:text-accent-orange"
                                >
                                    {t('more')}
                                    <IoIosArrowDown />
                                </button>
                            )}
                        {expandedCatId === parentCategory?.id && (
                            <button
                                onClick={() => setExpandedCatId(null)}
                                className="mt-1 flex w-fit items-center gap-2 font-bolditalic text-sm hover:text-accent-orange"
                            >
                                {t('less')}
                                <IoIosArrowUp />
                            </button>
                        )}
                    </>
                )}
            </ul>
        </>
    )
}

export default ThirdLevelCategoriesList
