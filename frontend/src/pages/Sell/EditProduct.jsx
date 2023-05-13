import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useProduct, useUpdateProduct } from '../../api/api'
import { Spinner, Button, Form } from '../../components/ui'
import ProductForm from '../../forms/ProductForm'
import { BsArrowLeft } from 'react-icons/bs'
import CategoryList from './CategoryList'
import { prepareImages } from './utils'
import { useTranslation } from 'react-i18next'

const EditProduct = () => {
    const { t } = useTranslation()
    const { productId } = useParams()
    const { data, isLoading, error } = useProduct(productId)
    const [formData, setFormData] = useState()
    const [valid, setValid] = useState(true)
    const [changes, setChanges] = useState({})
    const [category, setCategory] = useState([])
    const updateProductMutation = useUpdateProduct()

    useEffect(() => {
        if (!formData) return
        let changedFields = Object.entries(formData).filter(
            ([key, value]) => value !== data[key]
        )
        if (category.length > 0) {
            if (
                category[category.length - 1].id !== data?.category?.id &&
                category[category.length - 1].is_lower
            )
                changedFields = [
                    ...changedFields,
                    ['category', category[category.length - 1].id],
                ]
        }
        if (
            JSON.stringify(formData.images) ===
            JSON.stringify(prepareImages(data?.images))
        ) {
            changedFields = changedFields.filter((el) => el[0] !== 'images')
        }
        if (changedFields)
            setChanges({
                ...Object.fromEntries(changedFields),
            })
    }, [formData, category])

    useEffect(() => {
        if (data) {
            setCategory([
                ...data?.category?.parents,
                { ...data?.category, is_lower: true },
            ])
        }
    }, [data])

    if (isLoading) return <Spinner />
    if (error) return error.message

    return (
        <div className="grid gap-4">
            <Form
                className="mx-auto grid gap-2 lg:w-10/12 xl:w-8/12"
                onSubmit={() =>
                    updateProductMutation.mutate({
                        id: data?.id,
                        body: changes,
                    })
                }
                errors={updateProductMutation.error?.response?.data}
            >
                <NavLink
                    to={`/products/${productId}`}
                    className="flex items-center gap-2 font-bold hover:text-accent-orange"
                >
                    <BsArrowLeft />
                    {t('product_page')}
                </NavLink>
                <h2 className="text-xl font-bold">{t('change_category')}</h2>
                <CategoryList category={category} setCategory={setCategory} />
                <ProductForm
                    data={data}
                    setData={setFormData}
                    setValid={setValid}
                    errors={updateProductMutation.error?.response?.data || {}}
                />
                <Button
                    type="submit"
                    color="accent-orange"
                    style="fill"
                    width="fit"
                    height={12}
                    px={5}
                    disabled={
                        !valid ||
                        Object.keys(changes).length === 0 ||
                        updateProductMutation.isLoading
                    }
                    className="mt-3"
                >
                    {updateProductMutation.isLoading ? (
                        <Spinner />
                    ) : (
                        t('update')
                    )}
                </Button>
            </Form>
        </div>
    )
}

export default EditProduct
