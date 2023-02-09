import React, { useEffect } from 'react'
import { NavLink, useLoaderData } from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import api from '../api/api';
import RatingStars from '../components/RatingStars';
import SearchHistoryContext from '../contexts/HistoryContext';
import { useContext } from 'react';
import Map from '../components/Map';
import Avatar from '../components/Avatar';

export const productLoader = ({ request, params }) => {
    return {
        id: params.productId,
        name: 'Apple Watch Ultra',
        author: {
            id: 4545545,
            first_name: 'Alex',
            last_name: 'Zawadsky',
            avatar: null,
            rate: 4.7,
            date_joined: '2022-02-20'
        },
        price: 1000,
        adress: 'Москва, Профсоюзная 45',
        pub_date: 'Yesterday, 17:00',
        img_urls: ['/watch.jpeg', '/iphone.jpg',],
        is_favourite: false,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pharetra sed risus ut blandit. Donec eleifend pellentesque diam, non rutrum sem congue sed. Donec consectetur, sem sed egestas faucibus, lorem dui tincidunt neque, vel commodo nibh ex eget ex. Mauris sit amet sem ultricies, rhoncus velit at, mollis leo. Suspendisse volutpat fermentum ipsum. Pellentesque sagittis aliquam efficitur. Curabitur at mi vel mauris sagittis elementum ut eu dui. Praesent nec cursus tellus. Sed sit amet elementum tortor. Sed ut magna euismod, rutrum velit eget, porta est. '
    }
}

const ProductPage = () => {

    const product = useLoaderData()
    const { updateHistory } = useContext(SearchHistoryContext)

    useEffect(() => {
        updateHistory(product)
    })

    return (
        <>
            <p className='text-primary-100 pb-3'>ID: {product.id}</p>
            <div className='grid grid-cols-2 gap-10'>
                <div className='grid gap-3'>
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className='text-primary-300'>{product.pub_date}</p>
                    <div className='w-full'>
                        <Carousel showStatus={false} useKeyboardArrows={true} centerMode={true}>
                            {product.img_urls.map((img_url, key) => (
                                <div key={key} className='border-2 border-primary-100 h-full'>
                                    <img className='w-1/2' src={img_url} />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                    <h2 className='font-bold text-2xl'>Description</h2>
                    <p>{product.description}</p>
                    <h2 className='font-bold text-2xl'>Adress</h2>
                    <Map adress={product.adress} />
                    <p>{product.adress}</p>
                </div>
                <div className='w-full'>
                    <div className='grid gap-5 h-fit fixed'>
                        <h2 className='font-bold text-3xl'>{product.price}$</h2>
                        <button className='border-2 border-accent-red px-5 py-3 text-accent-red font-bold rounded-full flex items-center gap-2 w-fit' onClick={() => api.toggleFavourite(product.id)}>
                            {product.is_favourite ? (
                                <>
                                    <AiFillHeart />
                                    Remove from favourites
                                </>
                            ) : (
                                <>
                                    <AiOutlineHeart />
                                    Add to favourites
                                </>
                            )}
                        </button>
                        <p className='font-bold text-xl'>Seller:</p>
                        <NavLink to={`/user/${product.author.id}`} className='border-2 border-black p-5 rounded-xl grid gap-3'>
                            <div className='flex items-center gap-5'>
                                <div className='w-10 h-10'>
                                    <Avatar avatar={product.author.avatar} />
                                </div>
                                <div>
                                    <p className='hover:text-accent-orange'>{product.author.last_name} {product.author.first_name}</p>
                                    <RatingStars rating={product.author.rate} />
                                </div>
                            </div>
                            <p className='text-sm text-primary-300'>On Grocket since {product.author.date_joined}</p>
                        </NavLink>
                        <NavLink className='bg-accent-orange text-white rounded-xl font-bold text-center px-7 py-3 w-fit' to={`/user/${product.author.id}/chat`}>Send message</NavLink>
                    </div>
                </div>


            </div>
        </>
    )
}

export default ProductPage