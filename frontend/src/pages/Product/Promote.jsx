import React from 'react'
import { useParams } from 'react-router'
import { useProduct, usePromotions } from '../../api/api'
import { ItemCard, Spinner, Title } from '../../components'

const Promote = () => {

    const { productId } = useParams()
    const promotions = usePromotions()
    const product = useProduct(productId)

    if (promotions.isLoading || product.isLoading) return <Spinner />
    if (promotions.error) return promotions.error.message

    return (
        <div cla>
            <Title text='Buy promotions for your product' />
            <p>

            </p>
            <h2>Promo types: </h2>
            <div className='grid grid-cols-5 gap-5'>
                {
                    promotions.data.map(promo => (
                        <div>
                            {promo.name}
                            <ItemCard product={{ ...product.data, promotions: [promo.name] }} />
                            <input type="checkbox" />
                        </div>

                    ))
                }
            </div>
        </div>
    )
}

export default Promote