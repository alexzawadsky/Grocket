import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import RatingStars from '../components/RatingStars';
import SearchHistoryContext from '../contexts/HistoryContext';
import { useContext } from 'react';
import Map from '../components/Map';
import Avatar from '../components/Avatar';
import 'lightbox.js-react/dist/index.css'
import { SlideshowLightbox } from 'lightbox.js-react'
import { BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { BsArrowRight } from 'react-icons/bs';
import { useMediaQuery } from 'react-responsive';
import { ReadMore } from '../components';
import api from '../api/api';


const SellerCard = ({ user }) => {
    return (
        <div className='border-2 border-black p-5 rounded-xl grid gap-3 w-full'>
            <div className='flex items-center gap-5'>
                <div className='w-10 h-10'>
                    <Avatar avatar={user.avatar} />
                </div>
                <div>
                    <NavLink to={`/user/${user.id}`} className='hover:text-accent-orange'>{user.last_name} {user.first_name}</NavLink>
                    <RatingStars rating={user.rate} />
                </div>
            </div>
            <p className='text-sm text-primary-300'>On Grocket since {user.date_joined.split("T")[0].split("-").reverse().join(".")}</p>
            <NavLink className='button-fill-orange justify-center !w-full' to={`/user/${user.id}/chat`}>Send message</NavLink>
        </div>
    )
}

const ProductPage = () => {

    const { updateHistory } = useContext(SearchHistoryContext)
    const [product, setProduct] = useState()
    const [isFavourite, setIsFavourite] = useState()
    const [pubDate, setPubDate] = useState()
    const { productId } = useParams()
    const isTablet = useMediaQuery({ query: '(max-width: 1023px)' })

    useEffect(() => {
        api.get(`/api/v1/products/${productId}`).then(res => {
            setProduct(res.data)
            setIsFavourite(res.data.is_favourited)
            setPubDate(res.data.pub_date)
            updateHistory(res.data)
        }).catch(err => alert(err.response.status))
    }, [])

    const handleFavourite = () => {
        setIsFavourite(prevState => !prevState)
        console.log('toggle')
    }

    return (
        <div>
            {product ?
                <>
                    <p className='text-primary-100 pb-3'>ID: {product.id}</p>
                    <div className='grid lg:grid-cols-[2fr_1fr] gap-10'>
                        <div className='grid gap-3'>
                            <h1 className="text-3xl font-bold flex items-center justify-between">
                                {product.name}
                                <button className='text-accent-red' onClick={handleFavourite}>{isFavourite ? <AiFillHeart /> : <AiOutlineHeart />}</button>
                            </h1>
                            <div className="flex xl:items-center justify-between flex-col xl:flex-row gap-3">
                                <span className='text-primary-300 flex items-center gap-2'>
                                    <BiTimeFive />
                                    <p>
                                        {product.pub_date.split('T')[0].split('-').reverse().join('.')}
                                    </p>
                                    <p>
                                        {[product.pub_date.split('T')[1].split(':')[0], product.pub_date.split('T')[1].split(':')[1]].join(':')}
                                    </p>
                                </span>
                                <div className="flex gap-3 md:gap-5 flex-wrap  items-center">
                                    {product.category.parents.map((el, key) => (
                                        <>
                                            <p>{el.title}</p>
                                            <BsArrowRight />
                                        </>
                                    ))}
                                    <p className='font-bold'>{product.category.title}</p>
                                </div>
                            </div>
                            {isTablet ? <h2 className='font-bold text-3xl'>{parseFloat(product.price).toFixed(0)} {product.price_currency}</h2> : null}
                            <SlideshowLightbox theme='lightbox' className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-5'>
                                {product.images.map((el, key) => <img key={key} src={el.image} className='border-2 rounded-xl aspect-auto' />)}
                            </SlideshowLightbox>
                            <h2 className='font-bold text-2xl flex items-center gap-5'>Description</h2>
                            <ReadMore text={product.description} />
                            <h2 className='font-bold text-2xl flex items-center gap-2'><FiMapPin />Address</h2>
                            {/* <Map adress={product.address} /> */}
                            <p>{product.address}</p>
                            {isTablet ? <><p className='font-bold text-2xl'>Seller</p><SellerCard user={product.user} /></> : null}
                        </div>
                        {!isTablet ? <div className='w-full'>
                            <div className='grid gap-3 h-fit fixed'>
                                <h2 className='font-bold text-3xl'>{parseFloat(product.price).toFixed(0)} {product.price_currency}</h2>
                                <p className='font-bold text-2xl'>Seller:</p>
                                <SellerCard user={product.user} />
                            </div>
                        </div> : null}
                    </div>
                </>
                : null
            }
        </div>
    )
}

export default ProductPage