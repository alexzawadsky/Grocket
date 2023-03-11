import { useState, useEffect, useRef } from 'react'
import useInput from '../../hooks/useInput'
import { Input } from '../../components'
import AvatarEditor from 'react-avatar-editor'
import { AiOutlineRotateLeft, AiOutlineRotateRight } from 'react-icons/ai'
import { saveImage, deleteImage } from './utils'
import { BsTrashFill } from 'react-icons/bs'
import { prepareImages } from './utils'

const ProductForm = ({ data, setData, setValid }) => {

    const editorRef = useRef()
    const imageInputRef = useRef()
    const editorWidth = 360 * (window.innerWidth / 1920)

    const [currentImage, setCurrentImage] = useState()
    const [images, setImages] = useState(data?.images || [])
    const [imageSize, setImageSize] = useState(1)
    const [imageRotation, setImageRotation] = useState(0)
    const [mainImageIndex, setMainImageIndex] = useState(0)
    const [allValid, setAllValid] = useState(false)
    const [imageUploading, setImageUploading] = useState(false)

    const name = useInput(data?.name || '', { isEmpty: true })
    const description = useInput(data?.description || '', { isEmpty: true })
    const price = useInput(data?.price || '', { isInt: true })
    const currency = useInput(data?.price_currency || '', { isEmpty: true })
    const address = useInput(data?.address || '', { isEmpty: true })
    // const [address, setAddress] = useState('')
    useEffect(() => {
        if (images && images.length > 0) {
            if (images.filter(el => el.is_main)[0]) {
                images.filter(el => el.is_main)[0].is_main = false
            }
            images[mainImageIndex].is_main = true
        }
    }, [mainImageIndex])

    useEffect(() => {
        if ([name, description, price, currency, address].every(el => el.allValid) && images.length > 0) {
            setAllValid(true)
        } else {
            setAllValid(false)
        }
        setData({
            name: name.value,
            description: description.value,
            price: price.value,
            price_currency: currency.value,
            address: address.value,
            images: prepareImages(images)
        })
    }, [name.value, description.value, price.value, currency.value, address.value, images])

    useEffect(() => {
        setValid(allValid)
    }, [allValid])

    return (
        <form className='grid grid-cols-[1fr_2fr_1fr] gap-2'>
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
                must={true}
            />
            {/* <AddressField
                        setAddress={setAddress}
                        split={true}
                    /> */}
            <div className='mt-2 bg-zinc-100 h-44 col-start-2 col-end-3 flex items-center justify-center'>
                MAP
            </div>
            <span></span>
            <div className='grid gap-2 pt-5 h-fit'>
                <h2 className="text-xl font-bold">Photos</h2>
                <input ref={imageInputRef} type="file" onChange={(e) => setCurrentImage(e.target.files[0])} />
                <div className='grid gap-3 w-fit h-fit'>
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
                            value={imageSize}
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
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => { saveImage(editorRef, images, setImages, setCurrentImage, imageInputRef, setImageUploading) }}
                            className='button-outline-orange'
                            type='button'
                            disabled={imageUploading || !currentImage}
                        >
                            Save image
                        </button>
                        {imageUploading && 'Uploading...'}
                    </div>
                </div>
            </div>
            <div className='grid gap-2 col-span-2 h-fit pt-5'>
                <h2 className='text-xl font-bold'>List of uploaded item's photos</h2>
                <p className='col-span-2'>You can choose main image by pressing on a circle below it</p>
                {images.length > 0 ?
                    <div className='col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 h-fit'>
                        {images.map((el, key) =>
                            <div key={key} className='w-full p-2 rounded-lg border-2 grid gap-2'>
                                <img className='w-full' src={el.image} />
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
        </form>
    )
}

export default ProductForm