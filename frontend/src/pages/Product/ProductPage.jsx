import { useContext } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import SearchHistoryContext from '../../contexts/HistoryContext';
import { Spinner, GMap, Title, Price, PublishTime, Button } from '../../components/ui';
import { ReadMore } from '../../components'
import { BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { useProduct, useFavouriteProduct } from '../../api/api';
import SellerCard from './SellerCard';
import Category from './Category';
import { Helmet } from 'react-helmet-async';
import AuthContext from '../../contexts/AuthProvider';
import ManageProductMenu from '../../components/ManageProductMenu/ManageProductMenu';
import useScreen from '../../hooks/useScreen';
import { useTranslation } from 'react-i18next';
import ImagesGallery from './ImagesGallery';

const ProductPage = () => {

    const { t } = useTranslation()
    const { updateHistory } = useContext(SearchHistoryContext)
    const { user } = useContext(AuthContext)
    const { productId } = useParams()
    const { isMaxTablet } = useScreen()
    const favouriteProductMutation = useFavouriteProduct()

    const { data, error, isLoading } = useProduct(productId)
    const handleFavourite = () => favouriteProductMutation.mutate({ id: productId, state: data?.is_favourited })

    if (data) updateHistory(data)
    if (error?.response?.status === 404) return (
        <div className='grid gap-3'>
            <Title text='Product not found' />
            <p>This can happen if product has been archived or deleted</p>
        </div>
    )
    if (error) return error.message
    if (isLoading) return <Spinner />

    return (
        <>
            <Helmet>
                <meta
                    name='application-name'
                    content='Grocket'
                />
                <title>{data?.name} - Grocket</title>
                <meta
                    name='og:title'
                    content={`${data?.name} - ${data.price}${data?.price_currency}`}
                />
                <meta
                    name='og:image'
                    content={data?.images[0]?.image} />
                <meta
                    name='og:desctiption'
                    content={`Buy ${data?.name} on Grocket for just ${data?.price}${data?.price_currency}`}
                />
            </Helmet>
            <div className='grid lg:grid-cols-[2fr_1fr] gap-10'>
                <div className='grid gap-4 md:gap-7'>
                    <div className='grid gap-1.5'>
                        <div className='flex items-center justify-between'>
                            <h1 className="text-3xl font-bold">
                                {data.name}
                            </h1>
                            {user?.user_id !== data?.user?.id && <Button
                                ariaLabel='add to favourites button'
                                className='text-accent-red dark:text-red-600 text-3xl'
                                onClick={handleFavourite}
                                border={false}
                            >
                                {data.is_favourited ? <AiFillHeart /> : <AiOutlineHeart />}
                            </Button>}
                        </div>
                        <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-3">
                            <span className='text-primary-300 dark:text-zinc-400 flex items-center gap-2'>
                                <BiTimeFive />
                                <PublishTime pubDate={data?.pub_date} />
                            </span>
                            <Category category={data.category} />
                        </div>
                    </div>
                    {isMaxTablet &&
                        <h2 className='font-bold text-3xl'>
                            {parseFloat(data.price).toFixed(0)} {data.price_currency}
                        </h2>}
                    <ImagesGallery images={data.images} />
                    <div className='grid gap-3'>
                        <h2 className='font-bold text-2xl flex items-center gap-5'>{t('description')}</h2>
                        <ReadMore text={data.description} limit={450} />
                    </div>
                    <div className='grid gap-3'>
                        <h2 className='font-bold text-2xl flex items-center gap-2'><FiMapPin />{t('address')}</h2>
                        <GMap address={data.address} />
                    </div>
                    {isMaxTablet && <>
                        <SellerCard profile={data.user} />
                        {data.user.id === user?.user_id && (
                            <div className='pb-3 grid gap-3'>
                                <h2 className='text-xl font-bold ml-3'>{t('manage_your_product')}</h2>
                                <ManageProductMenu product={data} />
                            </div>
                        )}
                    </>}
                    <p className='text-sm text-zinc-400' aria-label='product id and publish time'>
                        #{data?.id} · <PublishTime full pubDate={data?.pub_date} />
                    </p>
                </div>
                {!isMaxTablet && <aside aria-label='product page sidebar'>
                    <div className='w-fit grid gap-7 h-fit fixed' aria-label='sidebar'>
                        <Price
                            className='font-bold text-3xl'
                            price={data?.price}
                            currency={data?.price_currency}
                        />
                        <SellerCard profile={data.user} />
                        {data.user.id === user?.user_id && (
                            <div className='pb-3 grid gap-3'>
                                <h2 className='text-xl font-bold ml-3'>{t('manage_your_product')}</h2>
                                <ManageProductMenu product={data} />
                            </div>
                        )}
                    </div>
                </aside>}
            </div>
        </>
    )
}

export default ProductPage