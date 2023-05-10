import { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Title, Spinner, Button, Form } from '../../components/ui'
import { BsCheckCircleFill } from 'react-icons/bs'
import { AiOutlineCheck } from 'react-icons/ai'
import AuthContext from '../../contexts/AuthProvider'
import CategoryList from './CategoryList'
import { useAddProduct } from '../../api/api'
import ProductForm from '../../forms/ProductForm'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

const Sell = () => {
    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const [formData, setFormData] = useState(null)
    const [stage, setStage] = useState(1)
    const [category, setCategory] = useState([])
    const [formValid, setFormValid] = useState(false)
    const addProductMutation = useAddProduct()

    const handleSubmit = () => {
        addProductMutation.mutate({
            ...formData,
            category: category.at(-1).id,
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

    if (!user)
        return (
            <Title text="You need to login to your account to be able to sell items" />
        )

    return (
        <div className="mx-auto flex w-full flex-col gap-5 md:grid xl:w-8/12">
            <Helmet>
                <title>Sell item - Grocket</title>
            </Helmet>
            <Title text={t('sell_your_item')} className="col-span-full" />
            {stage >= 1 && (
                <>
                    <h2 className="col-span-full text-xl font-bold">
                        {t('category')}
                    </h2>
                    <CategoryList
                        category={category}
                        setCategory={setCategory}
                    />
                </>
            )}
            {stage === 2 && (
                <Form
                    onSubmit={handleSubmit}
                    errors={addProductMutation.error?.response?.data}
                >
                    <ProductForm
                        errors={addProductMutation.error?.response?.data || {}}
                        setData={setFormData}
                        setValid={setFormValid}
                    />
                    <Button
                        type="submit"
                        disabled={!formValid || addProductMutation.isLoading}
                        width="fit"
                        style="fill"
                        color="accent-orange"
                        height={12}
                        px={5}
                        className="mt-5"
                    >
                        <AiOutlineCheck />
                        {addProductMutation.isLoading ? (
                            <Spinner />
                        ) : (
                            t('place_item')
                        )}
                    </Button>
                </Form>
            )}
        </div>
    )
}

export default Sell
