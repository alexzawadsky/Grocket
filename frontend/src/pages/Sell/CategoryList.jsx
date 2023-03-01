import React, { useState, useEffect } from 'react'
import api, { useCategories } from '../../api/api'
import { BsArrowRight, BsTrashFill } from 'react-icons/bs'
import Spinner from '../../components/Spinner'

const CategoryList = ({ category, setCategory }) => {

    const [lastChild, setLastChild] = useState(null)
    const [parentId, setParentId] = useState(null)
    const { data, isLoading, error } = useCategories(parentId)

    useEffect(() => {
        setParentId(lastChild?.id)
    }, [lastChild])

    const updateCategory = (newCategory) => {
        setCategory([...category, newCategory])
        setLastChild(newCategory)
    }
    return (
        <div className="flex gap-5">
            {category.length > 0 && <div className="flex gap-3 md:gap-5 flex-wrap items-center h-fit">
                {category.map((el, key) => (
                    <div key={key} className='flex gap-5 items-center'>
                        <p className={`${el.is_lower ? 'font-bold' : null}`}>{el.title}</p>
                        {el.is_lower ? null : <BsArrowRight />}
                    </div>
                ))}
            </div>}
            {!lastChild?.is_lower ?
                <div className='grid gap-2 px-5 h-fit'>
                    {isLoading ? <Spinner /> :
                        error ? error.message : data.map((el, key) =>
                            <div className='list-item cursor-pointer hover:marker:text-accent-orange' key={key} onClick={() => updateCategory(el)}>
                                {el.title}
                            </div>)}
                </div> : null}
            {lastChild?.is_lower && <button className='text-accent-red' onClick={() => setCategory(null)}><BsTrashFill /></button>}
        </div>
    )
}

export default CategoryList