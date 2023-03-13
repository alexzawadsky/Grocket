import { useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { useParams } from 'react-router'
import { NavLink } from 'react-router-dom'
import { useProduct, usePromotions } from '../../api/api'
import { Price, Spinner, Title, SearchItemCard } from '../../components'
import useAxios from '../../hooks/useAxios'
import { alertErr } from '../../utils'

const Promote = () => {

    const { productId } = useParams()
    const promotions = usePromotions()
    const product = useProduct(productId)
    const [selected, setSelected] = useState([])
    const api = useAxios()

    const updateSelected = (promo) => {
        if (selected.filter(el => el.id === promo.id).length > 0) {
            setSelected(selected.filter(el => el.id !== promo.id))
        } else {
            setSelected([...selected, promo])
        }
    }

    const handleSubmit = () => {
        api.post(`/api/v1/products/${product.data?.id}/promote/`, { promotions: selected.map(el => el.id) }).then(res => alert('saved')).catch(err => alertErr(err))
    }

    if (promotions.isLoading || product.isLoading) return <Spinner />
    if (promotions.error) return promotions.error.message

    return (
        <div className='grid grid-cols-[1fr_3fr] gap-5'>
            <NavLink
                to={`/products/${product.data?.id}`}
                className='col-span-full flex items-center gap-2 font-bold hover:text-accent-orange'
            >
                <BsArrowLeft />
                Product page
            </NavLink>
            <div className="col-span-full">
                <Title text='Buy promotions for your product' />
            </div>
            <div className='grid h-fit gap-4'>
                {
                    promotions.data.map((promo, key) =>
                        <div className='grid gap-2' key={key}>
                            <h3 className='font-bold text-lg'>
                                {promo?.title}
                            </h3>
                            <p>
                                {promo?.description}
                            </p>
                            <p className='font-bold'>
                                <Price price={promo?.price} currency={promo?.price_currency} />
                            </p>
                            <div className="flex items-center gap-2">
                                <input
                                    type='checkbox'
                                    id={`select-${promo?.name}`}
                                    onChange={(e) => updateSelected(promo)}
                                    checked={selected.filter(el => el.id === promo.id).length > 0 || product.data?.promotions.includes(promo?.name)}
                                    disabled={product.data?.promotions.includes(promo?.name)}
                                />
                                <label htmlFor={`select-${promo?.name}`}>
                                    {
                                        selected.filter(el => el.id === promo.id).length > 0 || product.data?.promotions.includes(promo?.name) ?
                                            'Selected' : 'Select'
                                    }
                                </label>
                            </div>
                        </div>
                    )
                }
                <button
                    disabled={selected.length === 0}
                    className='button-fill-orange'
                    onClick={handleSubmit}
                >
                    Proseed to checkout
                </button>
            </div>
            <div>
                <SearchItemCard
                    product={{
                        ...product.data,
                        promotions: selected.map(el => el.name)
                    }}
                />
            </div>
        </div>
    )
}

export default Promote