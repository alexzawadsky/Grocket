import React, { useContext, useEffect, useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { Title, Input, Spinner } from '../../components'
import useInput from '../../hooks/useInput'
import { BsCheckCircleFill, BsTrashFill } from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineRotateRight, AiOutlineRotateLeft } from 'react-icons/ai'
import AuthContext from '../../contexts/AuthProvider'
import CategoryList from './CategoryList'
import { useAddProduct } from '../../api/api'
import { deleteImage } from './utils'
import AddressField from '../../components/AddressField'
import ProductForm from '../../forms/ProductForm'
import { useTranslation } from 'react-i18next'

const Sell = () => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const [formData, setFormData] = useState(null)
    const [stage, setStage] = useState(1)
    const [category, setCategory] = useState([])
    const [formValid, setFormValid] = useState(false)
    const addProductMutation = useAddProduct()

    const handleSubmit = (e) => {
        e.preventDefault()
        addProductMutation.mutate({
            ...formData,
            category: category[category.length - 1].id
        })
    }

    useEffect(() => {
        if (category.length > 0 && category[category.length - 1].is_lower) {
            setStage(2)
        } else {
            setStage(1)
            setFormData(null)
        }
    }, [category])

    if (!user) return <Title text='You need to login to your account to be able to sell items' />

    return (
        <div className='flex flex-col    md:grid gap-5'>
            <Title
                text={t('sell_your_item')}
                className='col-span-full'
            />
            {stage >= 1 && !addProductMutation.data &&
                <>
                    <h2 className='col-span-full text-xl font-bold' >
                        {t('category')}
                    </h2>
                    <CategoryList
                        category={category}
                        setCategory={setCategory}
                    />
                </>}
            {stage === 2 && !addProductMutation.data &&
                <div>
                    <ProductForm setData={setFormData} setValid={setFormValid} />
                    <button
                        disabled={!formValid}
                        className="button-fill-orange mt-5 disabled:border-2 disabled:bg-white disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-600"
                        onClick={handleSubmit}
                    >
                        <AiOutlineCheck />{addProductMutation.isLoading ? <Spinner /> : t('place_item')}
                    </button>
                    {addProductMutation.isError && addProductMutation.error.message}
                </div>
            }
            {addProductMutation.data ?
                <div className='grid gap-5'>
                    <h2 className='text text-xl text-green-600 flex items-center gap-3'><BsCheckCircleFill />{t('sell_success')}</h2>
                    <span className='flex gap-1'>
                        <p>{t('you_can_check')}</p>
                        <NavLink
                            className='text-accent-orange hover:underline'
                            to={`/products/${addProductMutation.data.id}`}
                        >
                            {t('its_page')}
                        </NavLink>
                        <p>{t('list_of')}</p>
                        <NavLink
                            className='text-accent-orange hover:underline'
                            to='/profile/lots'>{t('all_your_items')}</NavLink>
                    </span>
                </div> : null
            }
        </div >
    )
}

export default Sell