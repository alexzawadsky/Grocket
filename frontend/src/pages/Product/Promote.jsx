import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsArrowLeft } from 'react-icons/bs'
import { useParams } from 'react-router'
import { NavLink } from 'react-router-dom'
import { useProduct, usePromotions } from '../../api/api'
import { Price, Spinner, Title, Button } from '../../components/ui'
import { ItemCard } from '../../components'
import useAxios from '../../hooks/useAxios'
import useScreen from '../../hooks/useScreen'
import { alertErr } from '../../utils'
import SearchItemCardTemplate from './SearchItemCardTemplate'
import CardModeToggle from '../Search/CardModeToggle'

const Promote = () => {

    const { t } = useTranslation()
    const { productId } = useParams()
    const { isMinTablet } = useScreen()
    const promotions = usePromotions()
    const product = useProduct(productId)
    const [selected, setSelected] = useState([])
    const api = useAxios()
    const [isList, setIsList] = useState(true)

    const updateSelected = (promo) => {
        console.log(promo.id)
        if (selected.filter(el => el.id === promo.id).length > 0) {
            setSelected(selected.filter(el => el.id !== promo.id))
        } else {
            setSelected([...selected, promo])
        }
    }

    const handleSubmit = () => {
        api.post(`/api/v1/products/${product.data?.id}/promote/`, { promotions: selected.map(el => el.id) }).then(res => alert('saved')).catch(err => alertErr(err))
    }

    if (promotions.error) return promotions.error.message
    if (product.error) return product.error.message

    return (
        <>
            <NavLink
                to={`/products/${product.data?.id}`}
                className='col-span-full flex items-center gap-2 font-bold hover:text-accent-orange'
            >
                <BsArrowLeft />
                {t('product_page')}
            </NavLink>
            <Title text={t('buy_promotions_head')} />
            <div className='grid lg:grid-cols-[1fr_3fr] gap-5'>
                <div>
                    <ul className='grid h-fit gap-4'>
                        {promotions.isLoading && <Spinner />}
                        {
                            promotions.data?.map((promo, key) =>
                                <div className='grid gap-2' key={key}>
                                    <h3 className='font-bold text-lg'>
                                        {promo?.title}
                                    </h3>
                                    <p>{promo?.description} </p>
                                    <Price
                                        className='font-bold'
                                        price={promo?.price}
                                        currency={promo?.price_currency}
                                    />
                                    <div className="flex items-center gap-2">
                                        <input
                                            className='rounded-md accent-accent-orange/[0.5] h-4 w-4'
                                            type='checkbox'
                                            id={`select-${promo?.name}`}
                                            onChange={(e) => updateSelected(promo)}
                                            checked={selected.find(el => el.id === promo.id) || product.data?.promotions.includes(promo?.name)}
                                            disabled={product.data?.promotions.includes(promo?.name)}
                                        />
                                        <label htmlFor={`select-${promo?.name}`}>
                                            {
                                                product.data?.promotions.includes(promo?.name) ? t('active') :
                                                    selected.find(el => el.id === promo.id) ?
                                                        t('selected') : t('select')
                                            }
                                        </label>
                                    </div>
                                </div>
                            )
                        }
                    </ul>
                    <Button
                        disabled={selected.length === 0}
                        style='fill'
                        color='accent-orange'
                        width='full'
                        onClick={handleSubmit}
                        height={12}
                        px={5}
                        className='mt-3'
                    >
                        {t('proceed_to_checkout')}
                    </Button>
                </div>
                <div>
                    {isMinTablet && <div className='mb-5 md:mb-0 md:ml-5'>
                        <CardModeToggle state={isList} setState={setIsList} />
                    </div>}
                    {!product.isLoading && <div className={`${!isList && 'grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 mt-0'} relative overflow-hidden mt-5`}>
                        {isMinTablet && <div style={{
                            WebkitMaskImage: isList && '-webkit-gradient(linear, left bottom, left top, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))'
                        }}>
                            <div className={isList && '-mt-32'}>
                                <SearchItemCardTemplate horizontal={isList} />
                            </div>
                        </div>}
                        <ItemCard
                            search
                            horizontal={isList}
                            product={{
                                ...product.data,
                                promotions: [...selected.map(el => el.name), ...product.data?.promotions]
                            }}
                        />
                        {isMinTablet && <div style={{
                            WebkitMaskImage: isList && '-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))'
                        }}>
                            <SearchItemCardTemplate horizontal={isList} />
                        </div>}
                    </div>}
                </div>
            </div>

        </>
    )
}

export default Promote