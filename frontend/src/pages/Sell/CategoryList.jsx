import React, { useState, useEffect } from 'react'
import { useCategories } from '../../api/api'
import { BsArrowRight, BsTrashFill } from 'react-icons/bs'
import Spinner from '../../components/ui/Spinner'
import useScreen from '../../hooks/useScreen'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui'
import cn from 'classnames'
import { IoIosArrowBack } from 'react-icons/io'

const CategoryList = ({ category, setCategory }) => {

    const [lastChild, setLastChild] = useState(null)
    const { data, isLoading, error } = useCategories({ parent_id: lastChild?.id })
    const { isMinTablet } = useScreen()
    const { t } = useTranslation()

    useEffect(() => {
        setLastChild(category.length > 0 ? category[category.length - 1] : null)
    }, [category])

    const updateCategory = (newCategory) => setCategory([...category, newCategory])
    const removeLastCategory = () => setCategory(category.slice(0, category.length - 1))

    return (
        <div className="flex flex-col md:flex-row gap-2 md:gap-5">
            {category.length > 0 && <ul className="flex gap-x-2 gap-y-1 md:gap-5 flex-wrap items-center h-fit">
                {category.map((el, key) => (
                    <li key={key} className='flex gap-2 md:gap-5 items-center'>
                        <p className={`${el.is_lower ? 'font-bold' : null}`}>{el.title}</p>
                        {el.is_lower ? null : <BsArrowRight />}
                    </li>
                ))}
            </ul>}
            {!category[category.length - 1]?.is_lower &&
                <div>
                    <ul className={cn(
                        isLoading && '!w-32 gap-1 !border-none',
                        data?.length > 10 && 'grid-cols-[1fr_1fr]',
                        'grid h-fit w-fit rounded-xl p-1 border dark:border-2 dark:border-zinc-600'
                    )}>
                        {isLoading && <Spinner type='category' count={5} />}
                        {data && data.map((el, key) =>
                            <li
                                className='h-fit py-1 rounded-lg align-baseline w-full hover:bg-slate-100 dark:hover:bg-zinc-700 px-2 cursor-pointer'
                                key={key}
                                onClick={() => updateCategory(el)}
                            >
                                {el.title}
                            </li>)}
                    </ul>
                    {category.length > 0 && <Button
                        className='mt-1 hover:text-accent-orange ml-[10px] !gap-0.5'
                        onClick={removeLastCategory}
                        type='button'
                        border={false}
                    >
                        <IoIosArrowBack />{t('back')}
                    </Button>}
                </div>}

            {category[category.length - 1]?.is_lower &&
                <Button
                    border={false}
                    type='button'
                    width='fit'
                    textColor='accent-red'
                    className=''
                    onClick={() => setCategory([])}
                >
                    <BsTrashFill />{!isMinTablet && t('change_category')}
                </Button>}
        </div>
    )
}

export default CategoryList