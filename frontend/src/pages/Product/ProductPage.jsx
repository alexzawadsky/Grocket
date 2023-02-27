import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import SearchHistoryContext from '../../contexts/HistoryContext';
import { ReadMore, Spinner, Map } from '../../components';
import { BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { useMediaQuery } from 'react-responsive';
import { useProcuct } from '../../api/api';
import SellerCard from './SellerCard';
import ImagesGallery from './ImagesGallery';
import Category from './Category';

const ProductPage = () => {

    const { updateHistory } = useContext(SearchHistoryContext)
    const { productId } = useParams()
    const isTablet = useMediaQuery({ query: '(max-width: 1023px)' })

    const { data, error, isLoading } = useProcuct(productId)

    if (data) updateHistory(data)
    if (error) return error.message
    if (isLoading) return <Spinner />

    return (
        <div>
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
                    {isTablet && <h2 className='font-bold text-3xl'>{parseFloat(data.price).toFixed(0)} {data.price_currency}</h2>}
                    <ImagesGallery images={data.images} />
                    <h2 className='font-bold text-2xl flex items-center gap-5'>Description</h2>
                    <ReadMore text={data.description} />
                    <h2 className='font-bold text-2xl flex items-center gap-2'><FiMapPin />Address</h2>
                    <Map adress={data.address} />
                    <p>{data.address}</p>
                    {isTablet && <><p className='font-bold text-2xl'>Seller</p><SellerCard profile={data.user} /></>}
                </div>
                {!isTablet && <div className='w-full'>
                    <div className='grid gap-3 h-fit fixed'>
                        <h2 className='font-bold text-3xl'>{parseFloat(data.price).toFixed(0)} {data.price_currency}</h2>
                        <SellerCard profile={data.user} />
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default ProductPage