import { useState, useEffect } from 'react'
import useInput from '../hooks/useInput'
import { Input, ImageEditor, AddressField, GMap, TextEditor } from '../components/ui'
import { deleteImage } from '../pages/Sell/utils'
import { BsTrashFill } from 'react-icons/bs'
import { prepareImages } from '../pages/Sell/utils'
import { useTranslation } from 'react-i18next'
import useScreen from '../hooks/useScreen'

const ProductForm = ({ data, setData, setValid }) => {

    const { t } = useTranslation()
    const [images, setImages] = useState(data?.images || [])
    const [mainImageIndex, setMainImageIndex] = useState(0)
    const [allValid, setAllValid] = useState(false)
    const { isMinPC, isMinTablet, isLargePC } = useScreen()

    const name = useInput(data?.name || '', { isEmpty: true })
    const [description, setDescription] = useState(data?.description || '')
    const price = useInput(data?.price || '', { isFloat: true })
    const currency = useInput(data?.price_currency || '', { isEmpty: true })
    const [address, setAddress] = useState(data?.address || null)

    useEffect(() => {
        if (images && images.length > 0) {
            if (images.filter(el => el.is_main)[0]) {
                images.filter(el => el.is_main)[0].is_main = false
            }
            images[mainImageIndex].is_main = true
        }
    }, [mainImageIndex])

    useEffect(() => {
        if ([name, price, currency].every(el => el.allValid) && images.length > 0 && description.length > 0) {
            setAllValid(true)
        } else {
            setAllValid(false)
        }
        setData({
            name: name.value,
            description: description,
            price: price.value,
            price_currency: currency.value,
            address: address,
            images: prepareImages(images)
        })
    }, [name.value, description, price.value, currency.value, address, JSON.stringify(images)])

    useEffect(() => {
        setValid(allValid)
    }, [allValid])

    return (
        <div className='flex flex-col md:grid grid-cols-[5fr_9fr] xl:grid-cols-[auto_1fr_30px] gap-y-2 gap-x-5'>
            <h2 className='col-span-full text-xl font-bold pt-5'>
                {t('info')}
            </h2>
            <Input
                title={t('product_name')}
                instance={name}
                split={isMinTablet}
                must
                deleteBtn={isLargePC}
            />
            <label className='after:content-["*"] after:text-accent-red after:pl-1'>{t('description')}</label>
            <div className='col-start-2 md:col-end-2 lg:col-end-3'>
                <TextEditor
                    text={description}
                    setText={setDescription}
                />
            </div>
            <h2 className="text-xl font-bold col-span-full pt-5">
                {t('price')}
            </h2>
            <Input
                title={t('price')}
                instance={price}
                split={isMinTablet}
                must
                deleteBtn={isLargePC}
            />
            <Input
                title={t('currency')}
                instance={currency}
                split={isMinTablet}
                must
                deleteBtn={isLargePC}
            />
            <h2 className="text-xl font-bold col-span-full pt-5">
                {t('location')}
            </h2>
            <AddressField
                setAddress={setAddress}
                split={isMinTablet}
            />
            <div className='col-start-2 md:col-end-2 lg:col-end-3 flex items-center justify-center'>
                <GMap address={address} />
            </div>
            <div className="pt-5 col-start-1">
                <ImageEditor
                    images={images}
                    setImages={setImages}
                />
            </div>
            <div className='grid gap-2 lg:col-span-2 h-fit pt-5'>
                <h2 className='text-xl font-bold'>{t('list_of_images')}</h2>
                <p className='col-span-2'>{t('you_can_choose_main_image')}</p>
                {images.length > 0 ?
                    <ul className='col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-3 md:gap-5 h-fit'>
                        {images.map((el, key) =>
                            <li key={key} className='w-full p-2 rounded-lg border-2 grid gap-2 dark:border-zinc-600'>
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
                            </li>)}
                    </ul>
                    :
                    <p className='col-span-2 text-accent-red font-bold'>{t('upload_one_image')}</p>}
            </div>
        </div>
    )
}

export default ProductForm