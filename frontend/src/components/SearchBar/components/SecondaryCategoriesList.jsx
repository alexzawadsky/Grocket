import CategoryLink from './CategoryLink'
import ThirdLevelCategoriesList from './ThirdCategoriesList'
import { filterChildCategories } from '../utils'
import { useCategories } from '../../../api/api'
import { useEffect, useMemo, useState } from 'react'
import { Spinner } from '../../ui'
import cn from 'classnames'

const ChildCategoriesList = ({ parentCategory }) => {
    const { isLoading, data } = useCategories({ all: true })
    const [expandedCatId, setExpandedCatId] = useState(null)
    const childCategories = useMemo(
        () => filterChildCategories(data, parentCategory?.id),
        [data, parentCategory?.id]
    )

    useEffect(() => {
        setExpandedCatId(null)
    }, [parentCategory?.id])

    if (!parentCategory?.id) return

    return (
        <div className="h-full overflow-y-auto">
            {!isLoading ? (
                <CategoryLink category={parentCategory}>
                    <h2 className="hover block w-fit items-center gap-2 pb-5 text-3xl font-bold transition-all hover:gap-3 hover:text-accent-orange">
                        {parentCategory?.title}
                    </h2>
                </CategoryLink>
            ) : (
                <p className="h-12 w-56 animate-pulse bg-slate-100 duration-75 dark:bg-zinc-700"></p>
            )}
            <ul
                className={cn(
                    'flex h-[calc(100%-56px)] max-h-[calc(100vh-80px-40px-40px-40px-56px)] max-w-full flex-col flex-wrap gap-x-7 gap-y-3 overflow-x-auto',
                    isLoading && '!gap-5 !overflow-x-hidden pt-5'
                )}
                aria-label="second level categories list"
            >
                {isLoading &&
                    Array(12)
                        .fill(0)
                        .map((_, key) => <Spinner type="catlist" />)}
                {expandedCatId && (
                    <li>
                        <ThirdLevelCategoriesList
                            parentCategory={data.find(
                                (el) => el.id === expandedCatId
                            )}
                            categoriesList={filterChildCategories(
                                data,
                                data.find((el) => el.id === expandedCatId).id
                            )}
                            expandedCatId={expandedCatId}
                            setExpandedCatId={setExpandedCatId}
                            first
                        />
                    </li>
                )}
                {childCategories &&
                    childCategories.map((el, key) => (
                        <li className="max-w-[35%] lg:max-w-[30%] xl:max-w-[20%]">
                            <ThirdLevelCategoriesList
                                key={key}
                                parentCategory={el}
                                categoriesList={filterChildCategories(
                                    data,
                                    el?.id
                                )}
                                expandedCatId={expandedCatId}
                                setExpandedCatId={setExpandedCatId}
                            />
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export default ChildCategoriesList
