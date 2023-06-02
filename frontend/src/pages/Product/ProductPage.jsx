import { useContext, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { BsHeartFill, BsHeart } from 'react-icons/bs'
import SearchHistoryContext from '../../contexts/HistoryContext'
import {
    Spinner,
    GMap,
    Title,
    Price,
    PublishTime,
    Button,
} from '../../components/ui'
import { ReadMore } from '../../components'
import { BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { useProduct, useFavouriteProduct } from '../../api/api'
import SellerCard from './SellerCard'
import Category from './Category'
import { Helmet } from 'react-helmet-async'
import AuthContext from '../../contexts/AuthProvider'
import ManageProductMenu from '../../components/ManageProductMenu/ManageProductMenu'
import useScreen from '../../hooks/useScreen'
import { useTranslation } from 'react-i18next'
import ImagesGallery from './ImagesGallery'
import NotFound from '../NotFound/NotFound'
import NoResponse from '../../components/Placeholders/NoResponse'

const ProductPage = () => {
    const { productId } = useParams()
    const { data, error, isLoading } = useProduct(productId)
    const { t } = useTranslation()
    const { updateHistory } = useContext(SearchHistoryContext)
    const { user } = useContext(AuthContext)
    const { isMaxTablet, isMinTablet } = useScreen()
    const favouriteProductMutation = useFavouriteProduct()
    const userIsSeller = user?.user_id === data?.user?.id

    const handleFavourite = () =>
        favouriteProductMutation.mutate({
            id: data?.id,
            state: data?.is_favourited,
        })

    useEffect(() => {
        data && updateHistory(data)
    }, [data])

    if (error?.response?.status === 404) return <NotFound />
    if (error?.response?.status.toString()[0] === '5') return <NoResponse />
    if (error) return error.message
    if (isLoading) return <Spinner type="productPage" />

    return (
        <>
            <Helmet>
                <meta name="application-name" content="Grocket" />
                <title>{data?.name} - Grocket</title>
                <meta
                    name="og:title"
                    content={`${data?.name} - ${data.price}${data?.price_currency}`}
                />
                <meta
                    name="og:image"
                    content={`${window.location.host}${data?.images[0]?.image}`}
                />
                <meta
                    name="og:description"
                    content={`Buy ${data?.name} on Grocket for just ${data?.price}${data?.price_currency}`}
                />
            </Helmet>
            <div className="grid gap-5 md:grid-cols-[2fr_1fr] md:gap-x-7 lg:gap-x-10">
                <div className="grid gap-3 md:gap-7">
                    <div className="grid gap-1.5">
                        <div className="flex items-center justify-between gap-3 md:gap-5">
                            <h1 className="text-3xl font-bold">{data.name}</h1>
                            {user && (
                                <Button
                                    ariaLabel="add to favourites button"
                                    className="!border-none text-3xl !text-accent-red dark:!text-red-600"
                                    onClick={handleFavourite}
                                    border={false}
                                    disabled={userIsSeller}
                                >
                                    {userIsSeller && data?.favourites_count}
                                    {userIsSeller || data.is_favourited ? (
                                        <BsHeartFill size={25} />
                                    ) : (
                                        <BsHeart size={25} />
                                    )}
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
                            <span className="flex items-center gap-2 text-primary-300 dark:text-zinc-400">
                                <BiTimeFive />
                                <PublishTime pubDate={data?.pub_date} />
                            </span>
                            <Category category={data.category} />
                        </div>
                    </div>
                    {!isMinTablet && (
                        <Price
                            className="text-3xl font-bold"
                            price={data?.price}
                            currency={data?.price_currency}
                        />
                    )}
                    <ImagesGallery images={data.images} />
                    <div className="grid gap-1 md:gap-3">
                        <h2 className="flex items-center gap-5 text-2xl font-bold">
                            {t('description')}
                        </h2>
                        <ReadMore text={data.description} limit={450} />
                    </div>
                    <div className="grid gap-1 md:gap-3">
                        <h2 className="flex items-center gap-2 text-2xl font-bold">
                            <FiMapPin />
                            {t('address')}
                        </h2>
                        <GMap address={data.address} />
                    </div>
                </div>
                <aside
                    aria-label="product page sidebar"
                    className="grid h-fit w-full gap-4 md:sticky md:top-[85px] md:w-fit md:gap-7 md:pr-7"
                >
                    {isMinTablet && (
                        <Price
                            className="text-3xl font-bold"
                            price={data?.price}
                            currency={data?.price_currency}
                        />
                    )}
                    <SellerCard profile={data.user} />
                    {userIsSeller && (
                        <div className="grid gap-3">
                            <h2 className="ml-3 text-xl font-bold">
                                {t('manage_your_product')}
                            </h2>
                            <ManageProductMenu product={data} />
                        </div>
                    )}
                </aside>
                <p
                    className="text-sm text-zinc-400"
                    aria-label="product id and publish time"
                >
                    #{data?.id} · <PublishTime full pubDate={data?.pub_date} />
                </p>
            </div>
        </>
    )
}

export default ProductPage
