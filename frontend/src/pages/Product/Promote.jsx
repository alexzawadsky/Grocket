import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsArrowLeft, BsCheckCircleFill, BsCircle } from 'react-icons/bs'
import { useParams } from 'react-router'
import { NavLink, useSearchParams } from 'react-router-dom'
import { useProduct, usePromotions } from '../../api/api'
import { Price, Spinner, Title, Button } from '../../components/ui'
import { ItemCard } from '../../components'
import useAxios from '../../hooks/useAxios'
import useScreen from '../../hooks/useScreen'
import { alertErr } from '../../utils'
import SearchItemCardTemplate from './SearchItemCardTemplate'
import CardModeToggle from '../Search/CardModeToggle'
import cn from 'classnames'

const Promote = () => {
    const { t } = useTranslation()
    const { productId } = useParams()
    const [params, _] = useSearchParams()
    const { isMinTablet } = useScreen()
    const promotions = usePromotions()
    const product = useProduct(productId)
    const [selected, setSelected] = useState([])
    const api = useAxios()
    const [isList, setIsList] = useState(true)

    const updateSelected = (promo) => {
        console.log(promo.id)
        if (selected.filter((el) => el.id === promo.id).length > 0) {
            setSelected(selected.filter((el) => el.id !== promo.id))
        } else {
            setSelected([...selected, promo])
        }
    }

    const handleSubmit = () => {
        api.post(`/api/v1/products/${product.data?.id}/promote/`, {
            promotions: selected.map((el) => el.id),
        })
            .then((res) => alert('saved'))
            .catch((err) => alertErr(err))
    }

    return (
        <>
            <NavLink
                to={`/products/${product.data?.slug}`}
                className="col-span-full flex w-fit items-center gap-2 font-bold hover:text-accent-orange"
            >
                <BsArrowLeft />
                {params.get('redirect')
                    ? t('open_product_page')
                    : t('product_page')}
            </NavLink>
            {/* {params.get('redirect') && <p className='font-bold border-2 text-green-600 border-green-600 dark:border-green-300 dark:text-green-300 dark:bg-green-800 bg-green-100 py-3 px-5 rounded-lg w-fit text-lg'>
                {t('sell_success')}
            </p>} */}
            <Title text={t('buy_promotions_head')} />
            <div className="grid gap-5 lg:grid-cols-[1fr_3fr]">
                <div>
                    <ul
                        className="grid h-fit gap-5 md:max-lg:grid-cols-[1fr_1fr]"
                        aria-label="list of available product promotions"
                    >
                        {promotions.isError && (
                            <p>{t('promotions_fetch_error')}</p>
                        )}
                        {promotions.isLoading && (
                            <Spinner type="promotion" count={2} />
                        )}
                        {promotions.data &&
                            promotions.data?.map((promo, key) => (
                                <li
                                    className={cn(
                                        'grid cursor-pointer gap-2 rounded-xl border-2 p-5 shadow-sm transition-all hover:border-accent-orange/[.5] dark:border-zinc-600 dark:hover:border-accent-orange/[.5]',
                                        (selected.find(
                                            (el) => el.id === promo.id
                                        ) ||
                                            product.data?.promotions.includes(
                                                promo?.name
                                            )) &&
                                            'border-2 !border-accent-orange bg-accent-orange/[0.05]',
                                        product.data?.promotions.includes(
                                            promo?.name
                                        ) && '!cursor-default'
                                    )}
                                    key={key}
                                    aria-label={`${promo.title} promotion`}
                                    onClick={() =>
                                        !product.data?.promotions.includes(
                                            promo.name
                                        ) && updateSelected(promo)
                                    }
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="whitespace-normal text-lg font-bold">
                                            {promo?.title}{' '}
                                            {product.data?.promotions.includes(
                                                promo?.name
                                            ) && `(${t('bought')})`}
                                        </h3>
                                        {selected.find(
                                            (el) => el.id === promo.id
                                        ) ||
                                        product.data?.promotions.includes(
                                            promo?.name
                                        ) ? (
                                            <span className="text-xl text-accent-orange">
                                                <BsCheckCircleFill />
                                            </span>
                                        ) : (
                                            <span className="text-xl text-slate-200 dark:text-zinc-600">
                                                <BsCircle />
                                            </span>
                                        )}
                                    </div>
                                    <p aria-label="promotion description">
                                        {promo?.description}
                                    </p>
                                    <Price
                                        className="font-bold"
                                        price={promo?.price}
                                        currency={promo?.price_currency}
                                    />
                                </li>
                            ))}
                    </ul>
                    <Button
                        disabled={selected.length === 0}
                        style="fill"
                        color="accent-orange"
                        width="full"
                        onClick={handleSubmit}
                        height={12}
                        px={5}
                        className="mt-5"
                    >
                        {t('proceed_to_checkout')}
                    </Button>
                </div>
                <div>
                    {isMinTablet && (
                        <div className="mb-5 md:mb-0 md:ml-5">
                            <CardModeToggle
                                state={isList}
                                setState={setIsList}
                            />
                        </div>
                    )}
                    {
                        <div
                            className={`${
                                !isList &&
                                'mt-0 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4'
                            } relative mt-5 overflow-hidden`}
                        >
                            {isMinTablet && (
                                <div
                                    style={{
                                        WebkitMaskImage:
                                            isList &&
                                            '-webkit-gradient(linear, left bottom, left top, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))',
                                    }}
                                >
                                    <div className={isList && '-mt-32'}>
                                        <SearchItemCardTemplate
                                            horizontal={isList}
                                            loader={!product.data}
                                        />
                                    </div>
                                </div>
                            )}
                            {product.isLoading && (
                                <Spinner type={isList ? 'hcard' : 'vcard'} />
                            )}
                            {product.error && (
                                <SearchItemCardTemplate
                                    horizontal={isList}
                                    onFail
                                />
                            )}
                            {product.data && (
                                <ItemCard
                                    search
                                    horizontal={isList}
                                    product={{
                                        ...product.data,
                                        promotions: [
                                            ...selected.map((el) => el.name),
                                            ...product.data?.promotions,
                                        ],
                                    }}
                                />
                            )}
                            {isMinTablet && (
                                <div
                                    style={{
                                        WebkitMaskImage:
                                            isList &&
                                            '-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))',
                                    }}
                                >
                                    <SearchItemCardTemplate
                                        horizontal={isList}
                                        loader={!product.data}
                                    />
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Promote
