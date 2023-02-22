import React, { useEffect, useState, useContext } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import SearchHistoryContext from '../contexts/HistoryContext';
import { Avatar, RatingStars, ReadMore } from '../components';
import 'lightbox.js-react/dist/index.css'
import { SlideshowLightbox } from 'lightbox.js-react'
import { BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { BsArrowRight } from 'react-icons/bs';
import { useMediaQuery } from 'react-responsive';
import api from '../api/api';
import { alertErr } from '../utils';
import AuthContext from '../contexts/AuthProvider';


const SellerCard = ({ profile, user }) => {
    const date = new Date(profile.date_joined).toLocaleDateString(undefined,
        { year: 'numeric', month: 'short', day: 'numeric' }
    )
    return (
        <div className='border-2 border-black p-5 rounded-xl grid gap-3 w-full'>
            <div className='flex items-center gap-5'>
                <div className='w-10 h-10'>
                    <Avatar avatar={profile.avatar} />
                </div>
                <div>
                    <NavLink to={!user || user.user_id !== profile.id ? `/user/${profile.id}` : '/profile'} className='hover:text-accent-orange'>{profile.last_name} {profile.first_name} {user.user_id === profile.id ? '(me)' : null}</NavLink>
                    <RatingStars rating={profile.rate} />
                </div>
            </div>
            <p className='text-sm text-primary-300'>{`On Grocket since ${date}`}</p>
            {!user || user.user_id !== profile.id ? <NavLink className='button-fill-orange justify-center !w-full' to={`/user/${profile.id}/chat`}>Send message</NavLink> : null}
        </div>
    )
}

const ProductPage = () => {

    const { updateHistory } = useContext(SearchHistoryContext)
    const [product, setProduct] = useState()
    const [isFavourite, setIsFavourite] = useState()
    const { productId } = useParams()
    const isTablet = useMediaQuery({ query: '(max-width: 1023px)' })
    const { user } = useContext(AuthContext)

    useEffect(() => {
        api.get(`/api/v1/products/${productId}`).then(res => {
            setProduct(res.data)
            setIsFavourite(res.data.is_favourited)
            updateHistory(res.data)
        }).catch(err => alertErr(err))
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
                                    {new Date(product.pub_date).toLocaleDateString(undefined,
                                        { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
                                    )}
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
                            {isTablet ? <><p className='font-bold text-2xl'>Seller</p><SellerCard profile={product.user} user={user} /></> : null}
                        </div>
                        {!isTablet ? <div className='w-full'>
                            <div className='grid gap-3 h-fit fixed'>
                                <h2 className='font-bold text-3xl'>{parseFloat(product.price).toFixed(0)} {product.price_currency}</h2>
                                {/* <p className='font-bold text-2xl'>Seller:</p> */}
                                <SellerCard profile={product.user} user={user} />
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