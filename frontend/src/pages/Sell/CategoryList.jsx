import React, { useState, useEffect } from 'react'
import { useCategories } from '../../api/api'
import { BsArrowRight, BsTrashFill } from 'react-icons/bs'
import Spinner from '../../components/ui/Spinner'
import useScreen from '../../hooks/useScreen'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui'
import cn from 'classnames'
import { IoIosArrowBack } from 'react-icons/io'
import NoResponse from '../../components/Placeholders/NoResponse'

const CategoryList = ({ category, setCategory }) => {
    const [lastChild, setLastChild] = useState(null)
    const { data, isLoading, error } = useCategories({
        parent_id: lastChild?.id,
    })
    const { isMinTablet } = useScreen()
    const { t } = useTranslation()

    useEffect(() => {
        setLastChild(category.length > 0 ? category[category.length - 1] : null)
    }, [category])

    const updateCategory = (newCategory) =>
        setCategory([...category, newCategory])
    const removeLastCategory = () =>
        setCategory(category.slice(0, category.length - 1))

    return (
        <div className="flex flex-col gap-2 md:flex-row md:gap-5">
            {category.length > 0 && (
                <ul className="flex h-fit flex-wrap items-center gap-x-2 gap-y-1 md:gap-5">
                    {category.map((el, key) => (
                        <li
                            key={key}
                            className="flex items-center gap-2 md:gap-5"
                        >
                            <p
                                className={`${
                                    el.is_lower ? 'font-bold' : null
                                }`}
                            >
                                {el.title}
                            </p>
                            {el.is_lower ? null : <BsArrowRight />}
                        </li>
                    ))}
                </ul>
            )}
            {!category[category.length - 1]?.is_lower && (
                <div>
                    <ul
                        className={cn(
                            isLoading && '!w-32 gap-1 !border-none',
                            data?.length > 10 && 'grid-cols-[1fr_1fr]',
                            'grid h-fit w-fit rounded-xl border p-1 dark:border-2 dark:border-zinc-600'
                        )}
                    >
                        {isLoading ? (
                            <Spinner type="category" count={5} />
                        ) : error?.response?.status.toString()[0] === '5' ? (
                            <NoResponse />
                        ) : (
                            data &&
                            data.map((el, key) => (
                                <li
                                    className="h-fit w-full cursor-pointer rounded-lg px-2 py-1 align-baseline hover:bg-slate-100 dark:hover:bg-zinc-700"
                                    key={key}
                                    onClick={() => updateCategory(el)}
                                >
                                    {el.title}
                                </li>
                            ))
                        )}
                    </ul>
                    {category.length > 0 && (
                        <Button
                            className="ml-[10px] mt-1 !gap-0.5 hover:text-accent-orange"
                            onClick={removeLastCategory}
                            type="button"
                            border={false}
                        >
                            <IoIosArrowBack />
                            {t('back')}
                        </Button>
                    )}
                </div>
            )}

            {category[category.length - 1]?.is_lower && (
                <Button
                    border={false}
                    type="button"
                    width="fit"
                    textColor="accent-red"
                    className=""
                    onClick={() => setCategory([])}
                >
                    <BsTrashFill />
                    {!isMinTablet && t('change_category')}
                </Button>
            )}
        </div>
    )
}

export default CategoryList
