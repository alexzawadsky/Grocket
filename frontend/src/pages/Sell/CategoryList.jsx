import React, { useState, useEffect } from 'react'
import api, { useCategories } from '../../api/api'
import { BsArrowRight, BsTrashFill } from 'react-icons/bs'
import Spinner from '../../components/Spinner'

const CategoryList = ({ category, setCategory }) => {

    const [categoryStageList, setCategoryStageList] = useState()
    const [parentId, setParentId] = useState(null)
    const { data, isLoading, error } = useCategories(parentId)

    useEffect(() => {
        if (category) {
            setParentId(category[category.length - 1].id)
        } else {
            setParentId(null)
        }
    }, [category])

    const updateCategory = (newCategory) => {
        if (!category) {
            setCategory([newCategory])
        } else {
            setCategory([...category, newCategory])
        }
    }

    return (
        <div className="flex gap-5">
            {category && <div className="flex gap-3 md:gap-5 flex-wrap items-center h-fit">
                {category.map((el, key) => (
                    <div key={key} className='flex gap-5 items-center'>
                        <p className={`${el.is_lower ? 'font-bold' : null}`}>{el.title}</p>
                        {el.is_lower ? null : <BsArrowRight />}
                    </div>
                ))}
            </div>}
            {!category || !category[category.length - 1].is_lower ?
                <div className='grid gap-2 px-5 h-fit'>
                    {isLoading ? <Spinner /> :
                        error ? error.message : data.map((el, key) =>
                            <div className='list-item cursor-pointer hover:marker:text-accent-orange' key={key} onClick={() => updateCategory(el)}>
                                {el.title}
                            </div>)}
                </div> : null}
            {category && category[category.length - 1].is_lower && <button className='text-accent-red' onClick={() => setCategory(null)}><BsTrashFill /></button>}
        </div>
    )
}

export default CategoryList