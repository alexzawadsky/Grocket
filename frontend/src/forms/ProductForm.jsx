import { useState, useEffect, useContext } from 'react'
import useInput from '../hooks/useInput'
import {
    Input,
    ImageEditor,
    AddressField,
    GMap,
    TextEditor,
} from '../components/ui'
import { deleteImage } from '../pages/Sell/utils'
import { BsTrashFill } from 'react-icons/bs'
import { prepareImages } from '../pages/Sell/utils'
import { useTranslation } from 'react-i18next'
import useScreen from '../hooks/useScreen'
import CurrencyContext from '../contexts/CurrencyContext'
import getSymbolFromCurrency from 'currency-symbol-map'

const ProductForm = ({ data, setData, setValid, errors }) => {
    const { t } = useTranslation()
    const [images, setImages] = useState(data?.images || [])
    const [mainImageIndex, setMainImageIndex] = useState(0)
    const [allValid, setAllValid] = useState(false)
    const { isMinTablet, isLargePC } = useScreen()
    const { targetCurrency, exchangeRate, convertPrice } =
        useContext(CurrencyContext)

    const name = useInput(data?.name || '', { isEmpty: true })
    const description = useInput(data?.desctiprion || '')
    // const [description, setDescription] = useState(data?.description || '')
    const price = useInput(convertPrice(data?.price, false), { isFloat: true })
    const usdPrice = useInput(data?.price, { isFloat: true })
    const [address, setAddress] = useState(data?.address || null)

    useEffect(() => {
        if (images && images.length > 0) {
            if (images.filter((el) => el.is_main)[0]) {
                images.filter((el) => el.is_main)[0].is_main = false
            }
            images[mainImageIndex].is_main = true
        }
    }, [mainImageIndex])

    useEffect(() => {
        if ([name, price].every((el) => el.allValid) && images.length > 0) {
            setAllValid(true)
        } else {
            setAllValid(false)
        }
        setData({
            name: name.value,
            description: description.value,
            price: (price.value / exchangeRate).toFixed(2),
            address: address,
            images: prepareImages(images),
        })
    }, [
        name.value,
        description.value,
        price.value,
        address,
        JSON.stringify(images),
    ])

    useEffect(() => {
        setValid(allValid)
    }, [allValid])

    useEffect(() => {
        price.allValid &&
            usdPrice.setValue((price.value / exchangeRate).toFixed(2))
    }, [price.value])

    // useEffect(() => {
    //     usdPrice.allValid &&
    //         price.setValue((usdPrice.value * exchangeRate).toFixed(2))
    // }, [usdPrice.value])

    return (
        <div className="flex grid-cols-[5fr_9fr] flex-col gap-x-5 gap-y-2 md:grid xl:grid-cols-[auto_1fr_30px]">
            <h2 className="col-span-full pt-5 text-xl font-bold">
                {t('info')}
            </h2>
            <Input
                name="name"
                title={t('product_name')}
                instance={name}
                split={isMinTablet}
                must
                deleteBtn={isLargePC}
                hasError={errors['name']}
            />
            {/* <label className='after:pl-1 after:text-accent-red after:content-["*"]'>
                {t('description')}
            </label>
            <div className="col-start-2 md:col-end-2 lg:col-end-3">
                <TextEditor
                    name="description"
                    text={description}
                    setText={setDescription}
                />
            </div> */}
            <Input
                instance={description}
                must
                large
                split
                deleteBtn
                title={t('description')}
            />
            <h2 className="col-span-full pt-5 text-xl font-bold">
                {t('price')}
            </h2>
            <Input
                name="price"
                title={`${t('price')}, ${getSymbolFromCurrency(
                    targetCurrency
                )}`}
                instance={price}
                split={isMinTablet}
                must
                deleteBtn={isLargePC}
                hasError={errors['price']}
                placeholder="0"
            />
            {targetCurrency !== 'USD' && (
                <Input
                    title={`${t('price')}, $`}
                    instance={usdPrice}
                    split={isMinTablet}
                    must
                    deleteBtn={false}
                    disabled={true}
                />
            )}
            <h2 className="col-span-full pt-5 text-xl font-bold">
                {t('location')}
            </h2>
            <AddressField setAddress={setAddress} split={isMinTablet} />
            <div className="col-start-2 flex items-center justify-center md:col-end-2 lg:col-end-3">
                <GMap address={address} />
            </div>
            <div className="col-start-1 pt-5">
                <ImageEditor images={images} setImages={setImages} />
            </div>
            <div className="flex h-fit flex-col gap-2 pt-5 xl:col-span-2">
                <h2 className="w-full text-xl font-bold">
                    {t('list_of_images')}
                </h2>
                <p>{t('you_can_choose_main_image')}</p>
                {images.length > 0 ? (
                    <ul className="grid h-fit grid-cols-2 gap-3  md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                        {images.map((el, key) => (
                            <li
                                key={key}
                                className="grid w-full gap-2 rounded-lg border-2 p-2 dark:border-zinc-600"
                            >
                                <img className="w-full" src={el.image} />
                                <div className="flex w-full items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setMainImageIndex(key)}
                                        className={`h-4 w-4 rounded-full ${
                                            key === mainImageIndex
                                                ? 'bg-accent-orange'
                                                : 'border-2'
                                        }`}
                                    ></button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            deleteImage(
                                                key,
                                                images,
                                                setMainImageIndex,
                                                setImages
                                            )
                                        }
                                        className="text-accent-red"
                                    >
                                        <BsTrashFill />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="col-span-2 font-bold text-accent-red">
                        {t('upload_one_image')}
                    </p>
                )}
            </div>
        </div>
    )
}

export default ProductForm
