import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Title, Input } from '../components'
import useInput from '../hooks/useInput'
import { BsCheckCircleFill, BsArrowRight } from 'react-icons/bs'
import AuthContext from '../contexts/AuthProvider'

const categoriesMock = [
    { title: 'Electronics', is_lower: true, parent_id: 1 },
    { title: 'Devices', is_lower: true, parent_id: 2 },
    { title: 'Smart watches', is_lower: false, parent_id: 3 }
]

const Sell = () => {

    const { user } = useContext(AuthContext)

    const [stage, setStage] = useState(1)
    const [product, setProduct] = useState({ id: 1 })
    const [placed, setPlaced] = useState(false)
    const [category, setCategory] = useState()
    const [categoryStageList, setCategoryStageList] = useState(categoriesMock)

    const name = useInput('', { isEmpty: true })
    const description = useInput('', { isEmpty: true })
    const price = useInput('', { isInt: true })
    const currency = useInput('', { isEmpty: true })
    const address = useInput('', { isEmpty: true })

    useEffect(() => {
        if (category && !category[category.length - 1].is_lower) {
            setStage(2)
        }
    }, [category])

    const updateCategory = (newCategory) => {
        if (!category) {
            setCategory([newCategory])
        } else {
            setCategory([...category, newCategory])
        }
        if (!newCategory.is_lower)
            fetchCategories(newCategory.parent_id)
    }

    const fetchCategories = (parentId) => {
        console.log(parentId)
        setCategoryStageList(categoriesMock)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    // if (!user) {
    //     return <Title text='You need to login to your account to be able to sell items' />
    // }

    return (
        <div className='grid gap-5'>
            <Title text='Sell your item' className='col-span-full' />
            {stage >= 1 && !placed ?
                <>
                    <h2 className='col-span-full text-xl font-bold'>Category</h2>
                    <div className="flex gap-5">
                        {category ? <div className="flex gap-3 md:gap-5 flex-wrap items-center h-fit">
                            {category.map((el, key) => (
                                <div key={key} className='flex gap-5 items-center'>
                                    <p className={`${el.is_lower ? null : 'font-bold'}`}>{el.title}</p>
                                    {el.is_lower ? <BsArrowRight /> : null}
                                </div>
                            ))}
                        </div> : null}
                        {!category || category[category.length - 1].is_lower ?
                            <div className='grid gap-2 px-5'>
                                {categoryStageList.map((el, key) =>
                                    <div className='list-item cursor-pointer hover:marker:text-accent-orange' key={key} onClick={() => updateCategory(el)}>
                                        {el.title}
                                    </div>)}
                            </div> : null}
                    </div>
                </> : null}
            {stage === 2 && !placed ?
                <form onSubmit={handleSubmit} className='grid grid-cols-[1fr_2fr_1fr] gap-2'>
                    <h2 className='col-span-full text-xl font-bold pb-5'>Info</h2>
                    <Input title='Name' instance={name} split={true} />
                    <Input title='Description' instance={description} split={true} large={true} />
                    <h2 className="text-xl font-bold col-span-full pt-5">Price</h2>
                    <Input title='Price' instance={price} split={true} />
                    <Input title='Currency' instance={currency} split={true} />
                    <h2 className="text-xl font-bold col-span-full pt-5">Location</h2>
                    <Input title='Address' instance={address} split={true} />
                    <div className='mt-2 bg-zinc-100 h-44 col-start-2 col-end-3 flex items-center justify-center'>
                        MAP
                    </div>
                    <h2 className="text-xl font-bold col-span-full pt-5">Photos</h2>
                </form> : null}
            {placed ?
                <div className='grid gap-5'>
                    <h2 className='text text-xl text-green-600 flex items-center gap-3'><BsCheckCircleFill />Your item had been succesfully placed!</h2>
                    <span className='flex gap-1'>
                        <p>You can check</p>
                        <NavLink className='text-accent-orange hover:underline' to={`/products/${product.id}`}>it's page</NavLink>
                        <p>now or open a list of</p>
                        <NavLink className='text-accent-orange hover:underline' to='/profile/lots'>all your items</NavLink>
                    </span>
                </div> : null}
        </div>
    )
}

export default Sell