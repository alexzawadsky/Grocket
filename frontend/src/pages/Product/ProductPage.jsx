import { useContext } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import SearchHistoryContext from '../../contexts/HistoryContext';
import { ReadMore, Spinner, Map, Title, Price } from '../../components';
import { BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { useMediaQuery } from 'react-responsive';
import { useProduct } from '../../api/api';
import SellerCard from './SellerCard';
import ImagesGallery from './ImagesGallery';
import Category from './Category';
import { Helmet } from 'react-helmet-async';
import AuthContext from '../../contexts/AuthProvider';
import ManageProductMenu from '../../components/ManageProductMenu';
import useScreen from '../../hooks/useScreen';
import { useTranslation } from 'react-i18next';

const ProductPage = () => {

    const { t } = useTranslation()
    const { updateHistory } = useContext(SearchHistoryContext)
    const { user } = useContext(AuthContext)
    const { productId } = useParams()
    const { isMaxTablet } = useScreen()

    const { data, error, isLoading } = useProduct(productId)

    if (data) updateHistory(data)
    if (error?.response?.status === 404) return (
        <div className='grid gap-3'>
            <Title text='Product not found' />
            <p>This can happen if product has been archived or deleted</p>
            {user && <p>If it is your product you can find it in your <NavLink to='/profile' className='text-accent-orange'>profile</NavLink></p>}
        </div>
    )
    if (error) return error.message
    if (isLoading) return <Spinner />

    return (
        <div>
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
            <p className='text-primary-100 pb-3'>ID: {data.id}</p>
            <div className='grid lg:grid-cols-[2fr_1fr] gap-10'>
                <div className='grid gap-3'>
                    <h1 className="text-3xl font-bold flex items-center justify-between">
                        {data.name}
                        <button className='text-accent-red' >{data.is_favourited ? <AiFillHeart /> : <AiOutlineHeart />}</button>
                    </h1>
                    <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-3">
                        <span className='text-primary-300 flex items-center gap-2'>
                            <BiTimeFive />
                            {new Date(data.pub_date).toLocaleDateString(undefined,
                                { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
                            )}
                        </span>
                        <Category category={data.category} />
                    </div>
                    {isMaxTablet && <h2 className='font-bold text-3xl'>{parseFloat(data.price).toFixed(0)} {data.price_currency}</h2>}
                    <ImagesGallery images={data.images} />
                    <h2 className='font-bold text-2xl flex items-center gap-5'>{t('description')}</h2>
                    <ReadMore text={data.description} />
                    <h2 className='font-bold text-2xl flex items-center gap-2'><FiMapPin />{t('address')}</h2>
                    <Map adress={data.address} />
                    <p>{data.address}</p>
                    {isMaxTablet && <>
                        <p className='font-bold text-2xl'>Seller</p>
                        <SellerCard profile={data.user} />
                        {data.user.id === user?.user_id && (
                            <div className='pb-3 grid gap-3'>
                                <h2 className='text-xl font-bold'>{t('manage_your_product')}</h2>
                                <ManageProductMenu product={data} />
                            </div>
                        )}
                    </>}
                </div>
                {!isMaxTablet && <div className='w-full'>
                    <div className='grid gap-3 h-fit fixed'>
                        <h2 className='font-bold text-3xl'><Price price={data?.price} currency={data?.price_currency} /></h2>
                        <SellerCard profile={data.user} />
                        {data.user.id === user?.user_id && (
                            <div className='pb-3 grid gap-3'>
                                <h2 className='text-xl font-bold'>{t('manage_your_product')}</h2>
                                <ManageProductMenu product={data} />
                            </div>
                        )}
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default ProductPage