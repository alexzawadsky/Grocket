import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useProduct, useUpdateProduct } from '../../api/api'
import { Spinner, Title } from '../../components'
import { BiPencil } from 'react-icons/bi'
import ProductForm from './ProductForm'
import { BsArrowLeft } from 'react-icons/bs'
import CategoryList from './CategoryList'
import { prepareImages } from './utils'

const EditProduct = () => {

    const { productId } = useParams()
    const { data, isLoading, error } = useProduct(productId)
    const [formData, setFormData] = useState()
    const [valid, setValid] = useState(true)
    const [changes, setChanges] = useState({})
    const [category, setCategory] = useState([])

    const updateProductMutation = useUpdateProduct()

    useEffect(() => {
        if (!formData) return
        let changedFields = Object.entries(formData).filter(([key, value]) => value !== data[key])
        if (category.length > 0) {
            if ((category[category.length - 1].id !== data?.category?.id) && category[category.length - 1].is_lower)
                changedFields = [
                    ...changedFields,
                    ['category', category[category.length - 1].id]
                ]
        }
        if (JSON.stringify(formData.images) === JSON.stringify(prepareImages(data?.images))) {
            changedFields = changedFields.filter(el => el[0] !== 'images')
        }
        if (changedFields) setChanges({
            ...Object.fromEntries(changedFields),
        })

    }, [formData, category])

    useEffect(() => {
        if (data) {
            setCategory([
                ...data?.category?.parents,
                { ...data?.category, is_lower: true }
            ])
        }
    }, [data])

    if (isLoading) return <Spinner />
    if (error) return error.message

    return (
        <div className='grid gap-3'>
            <NavLink to={`/products/${productId}`} className='button-outline-orange'><BsArrowLeft />Open product page</NavLink>
            <div className="flex items-center gap-2">
                <p className="text-3xl"><BiPencil /></p>
                <Title text='Edit product' />
            </div>
            <h2 className='font-bold text-xl'>Change category</h2>
            <CategoryList
                category={category}
                setCategory={setCategory}
            />
            <ProductForm
                data={data}
                setData={setFormData}
                setValid={setValid}
            />
            <button
                onClick={() => updateProductMutation.mutate({ id: productId, body: changes })}
                className='button-fill-orange'
                disabled={!valid || Object.keys(changes).length === 0}
            >
                {updateProductMutation.isLoading ? 'Updating' : 'Update'}
            </button>
            {updateProductMutation.error && updateProductMutation.error.message}
        </div>
    )
}

export default EditProduct