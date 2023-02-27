import React, { useContext, useEffect, useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { Title, Input, Spinner } from '../../components'
import useInput from '../../hooks/useInput'
import { BsCheckCircleFill, BsTrashFill } from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineRotateRight, AiOutlineRotateLeft } from 'react-icons/ai'
import AuthContext from '../../contexts/AuthProvider'
import useAxios from '../../hooks/useAxios'
import AvatarEditor from 'react-avatar-editor'
import CategoryList from './CategoryList'
import { useAddProduct } from '../../api/api'
import { deleteImage, saveImage } from './utils'

const Sell = () => {

    const { user } = useContext(AuthContext)
    const api = useAxios()
    const editorRef = useRef()
    const imageInputRef = useRef()
    const editorWidth = 360 * (window.innerWidth / 1920)

    const [stage, setStage] = useState(1)
    const [product, setProduct] = useState()
    const [category, setCategory] = useState()
    const [currentImage, setCurrentImage] = useState()
    const [images, setImages] = useState(null)
    const [imageSize, setImageSize] = useState(1)
    const [imageRotation, setImageRotation] = useState(0)
    const [mainImageIndex, setMainImageIndex] = useState(0)
    const [allValid, setAllValid] = useState(false)

    const name = useInput('', { isEmpty: true })
    const description = useInput('', { isEmpty: true })
    const price = useInput('', { isInt: true })
    const currency = useInput('', { isEmpty: true })
    const address = useInput('', { isEmpty: true })

    let addProductMutation = useAddProduct()

    useEffect(() => {
        if (category && category[category.length - 1].is_lower) {
            setStage(2)
        } else {
            setStage(1)
            name.clear()
            description.clear()
            price.clear()
            currency.clear()
            address.clear()
            setImageRotation(0)
            setImageSize(1)
            setImages(null)
        }
    }, [category])

    useEffect(() => {
        if (images) {
            if (images.filter(el => el.is_main)[0]) {
                images.filter(el => el.is_main)[0].is_main = false
            }
            images[mainImageIndex].is_main = true
        }
    }, [mainImageIndex])

    useEffect(() => {
        if ([name, description, price, currency, address].every(el => el.allValid) && images && images.length > 0) {
            setAllValid(true)
        } else {
            setAllValid(false)
        }
    }, [name.value, description.value, price.value, currency.value, address.value, images])

    const handleSubmit = (e) => {
        e.preventDefault()
        const body = {
            name: name.value,
            description: description.value,
            price: price.value,
            price_currency: currency.value,
            address: address.value,
            category: category[category.length - 1].id,
            images: images
        }
        addProductMutation.mutate(body)
    }

    if (!user) return <Title text='You need to login to your account to be able to sell items' />

    return (
        <div className='grid gap-5'>
            <Title
                text='Sell your item'
                className='col-span-full'
            />
            {stage >= 1 && !addProductMutation.data &&
                <>
                    <h2 className='col-span-full text-xl font-bold' >
                        Category
                    </h2>
                    <CategoryList
                        category={category}
                        setCategory={setCategory}
                    />
                </>}
            {stage === 2 && !addProductMutation.data &&
                <form
                    onSubmit={handleSubmit}
                    className='grid grid-cols-[1fr_2fr_1fr] gap-2'
                >
                    <h2 className='col-span-full text-xl font-bold'>
                        Info
                    </h2>
                    <Input
                        title='Name'
                        instance={name}
                        split={true}
                        must={true}
                    />
                    <Input
                        title='Description'
                        instance={description}
                        split={true}
                        large={true}
                        must={true} />
                    <h2 className="text-xl font-bold col-span-full pt-5">
                        Price
                    </h2>
                    <Input
                        title='Price'
                        instance={price}
                        split={true}
                        must={true}
                    />
                    <Input
                        title='Currency'
                        instance={currency}
                        split={true}
                        must={true}
                    />
                    <h2 className="text-xl font-bold col-span-full pt-5">
                        Location
                    </h2>
                    <Input
                        title='Address'
                        instance={address}
                        split={true}
                        must={true} />
                    <div className='mt-2 bg-zinc-100 h-44 col-start-2 col-end-3 flex items-center justify-center'>
                        MAP
                    </div>
                    <span></span>
                    <div className='grid gap-2 pt-5'>
                        <h2 className="text-xl font-bold">Photos</h2>
                        <input ref={imageInputRef} type="file" onChange={(e) => setCurrentImage(e.target.files[0])} />
                        <div className='grid gap-3 w-fit'>
                            <AvatarEditor
                                ref={editorRef}
                                image={currentImage}
                                width={editorWidth}
                                height={Math.ceil(editorWidth / 4 * 3)}
                                border={20}
                                className='border-2'
                                color={[255, 255, 255, 0.6]}
                                scale={imageSize}
                                rotate={imageRotation}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setImageRotation(prevRotation => prevRotation - 90)}
                                    type='button'
                                    className='p-2 text-xl text-accent-orange'
                                >
                                    <AiOutlineRotateLeft />
                                </button>
                                <input
                                    min={1}
                                    max={2}
                                    step={0.01}
                                    onChange={(e) => setImageSize(e.target.value)}
                                    className='grow'
                                    type="range"
                                />
                                <button
                                    onClick={() => setImageRotation(prevRotation => prevRotation + 90)}
                                    type='button'
                                    className='p-2 text-xl text-accent-orange'
                                >
                                    <AiOutlineRotateRight />
                                </button>
                            </div>
                            <button
                                onClick={() => saveImage(editorRef, images, setImages, setCurrentImage, imageInputRef)}
                                className='button-outline-orange'
                                type='button'
                            >
                                Save image
                            </button>
                        </div>
                    </div>
                    <div className='grid gap-2 col-span-2 h-fit pt-5'>
                        <h2 className='text-xl font-bold'>List of uploaded item's photos</h2>
                        <p className='col-span-2'>You can choose main image by pressing on a circle below it</p>
                        {images ?
                            <div className='col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 h-fit'>
                                {images.map((el, key) =>
                                    <div key={key} className='w-full p-2 rounded-lg border-2 grid gap-2'>
                                        <img className='w-full' src={el.image_href} />
                                        <div className="flex gap-2 w-full items-center justify-between">
                                            <button
                                                type='button'
                                                onClick={() => setMainImageIndex(key)}
                                                className={`h-4 w-4 rounded-full ${key === mainImageIndex ? 'bg-accent-orange' : 'border-2'}`}>
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => deleteImage(key, images, setMainImageIndex, setImages)}
                                                className='text-accent-red'>
                                                <BsTrashFill />
                                            </button>
                                        </div>
                                    </div>)}
                            </div>
                            :
                            <p className='col-span-2 text-accent-red font-bold'>Upload at least one image to place an item</p>}
                    </div>
                    <button
                        disabled={!allValid}
                        className="button-fill-orange mt-5 disabled:border-2 disabled:bg-white disabled:cursor-not-allowed disabled:border-slate-600 disabled:text-slate-600"
                    >
                        <AiOutlineCheck />{addProductMutation.isLoading ? <Spinner /> : 'Place item'}
                    </button>
                    {addProductMutation.isError && addProductMutation.error.message}
                </form>}
            {addProductMutation.data ?
                <div className='grid gap-5'>
                    <h2 className='text text-xl text-green-600 flex items-center gap-3'><BsCheckCircleFill />Your item had been succesfully placed!</h2>
                    <span className='flex gap-1'>
                        <p>You can check</p>
                        <NavLink
                            className='text-accent-orange hover:underline'
                            to={`/products/${addProductMutation.data.id}`}
                        >
                            it's page
                        </NavLink>
                        <p>now or open a list of</p>
                        <NavLink
                            className='text-accent-orange hover:underline'
                            to='/profile/lots'>all your items</NavLink>
                    </span>
                </div> : null
            }
        </div >
    )
}

export default Sell