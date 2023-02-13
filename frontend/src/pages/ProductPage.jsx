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
import useAxios from '../hooks/useAxios';
import 'lightbox.js-react/dist/index.css'
import { SlideshowLightbox } from 'lightbox.js-react'
import { BiCategoryAlt, BiTimeFive } from 'react-icons/bi'
import { FiMapPin } from 'react-icons/fi'
import { BsArrowRight } from 'react-icons/bs';

const productMock = {
    id: 1111111,
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
    price_currency: 'RUB',
    address: 'Москва, Профсоюзная 45',
    pub_date: 'Yesterday, 17:00',
    images: ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/2.jpg', '/1.jpg', '/3.jpg', '/4.jpg'],
    is_favourite: false,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pharetra sed risus ut blandit. Donec eleifend pellentesque diam, non rutrum sem congue sed. Donec consectetur, sem sed egestas faucibus, lorem dui tincidunt neque, vel commodo nibh ex eget ex. Mauris sit amet sem ultricies, rhoncus velit at, mollis leo. Suspendisse volutpat fermentum ipsum. Pellentesque sagittis aliquam efficitur. Curabitur at mi vel mauris sagittis elementum ut eu dui. Praesent nec cursus tellus. Sed sit amet elementum tortor. Sed ut magna euismod, rutrum velit eget, porta est. ',
    category: {
        id: 1,
        title: 'Smart watches',
        parents: [
            {
                id: 2,
                title: 'Electronics'
            },
            {
                id: 3,
                title: 'Devices'
            }
        ]
    }
}


const ProductPage = () => {

    const { updateHistory } = useContext(SearchHistoryContext)
    const [product, setProcuct] = useState()
    const [isFavourite, setIsFavourite] = useState()
    const api = useAxios()
    const { productId } = useParams()

    useEffect(() => {
        api.get(`/api/v1/products/${productId}`).then(res => setProcuct(res.data)).catch(err => alert(err.response.status))
        setProcuct(productMock)
        setIsFavourite(productMock.is_favourite)
        updateHistory(productMock)
    }, [])

    const handleFavourite = () => {
        setIsFavourite(prevState => !prevState)
        console.log('toggle')
    }

    return (
        <>
            {product ?
                <div>
                    <p className='text-primary-100 pb-3'>ID: {product.id}</p>
                    <div className='grid grid-cols-[2fr_1fr] gap-10'>
                        <div className='grid gap-3'>
                            <h1 className="text-3xl font-bold flex items-center justify-between">
                                {product.name}
                                <button className='text-accent-red' onClick={handleFavourite}>{isFavourite ? <AiFillHeart /> : <AiOutlineHeart />}</button>
                            </h1>
                            <div className="flex items-center justify-between">
                                <p className='text-primary-300 flex items-center gap-2'><BiTimeFive />{product.pub_date}</p>
                                <div className="flex gap-5 items-center">
                                    {product.category.parents.map((el, key) => (
                                        <>
                                            <p>{el.title}</p>
                                            <BsArrowRight />
                                        </>
                                    ))}
                                    <p className='font-bold'>{product.category.title}</p>
                                </div>
                            </div>
                            <SlideshowLightbox theme='lightbox' className='grid grid-cols-4 items-center gap-5'>
                                {/* <Carousel showStatus={false} useKeyboardArrows={true} centerMode={true}>
                                    {product.img_urls.map((img_url, key) => (
                                        <div key={key} className='border-2 border-primary-100 h-52 w-52'>
                                            <img className='h-52 w-52' src={img_url} />
                                        </div>
                                    ))}
                                </Carousel> */}
                                {product.images.map((el, key) => <img key={key} src={el} className='border-2 rounded-xl aspect-auto' />)}
                            </SlideshowLightbox>
                            <h2 className='font-bold text-2xl flex items-center gap-5'>Description</h2>
                            <p>{product.description}</p>
                            <h2 className='font-bold text-2xl flex items-center gap-2'><FiMapPin />Adress</h2>
                            {/* <Map adress={product.address} /> */}
                            <p>{product.address}</p>
                        </div>
                        <div className='w-full'>
                            <div className='grid gap-3 h-fit fixed'>
                                <h2 className='font-bold text-3xl'>{product.price} {product.price_currency}</h2>
                                <p className='font-bold text-2xl'>Seller:</p>
                                <div className='border-2 border-black p-5 rounded-xl grid gap-3'>
                                    <div className='flex items-center gap-5'>
                                        <div className='w-10 h-10'>
                                            <Avatar avatar={product.author.avatar} />
                                        </div>
                                        <div>
                                            <NavLink to={`/user/${product.author.id}`} className='hover:text-accent-orange'>{product.author.last_name} {product.author.first_name}</NavLink>
                                            <RatingStars rating={product.author.rate} />
                                        </div>
                                    </div>
                                    <p className='text-sm text-primary-300'>On Grocket since {product.author.date_joined}</p>
                                    <NavLink className='button-fill-orange justify-center !w-full' to={`/user/${product.author.id}/chat`}>Send message</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null}
        </ >
    )
}

export default ProductPage