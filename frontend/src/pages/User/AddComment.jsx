import { NavLink, useParams } from "react-router-dom"
import { BsArrowLeft } from "react-icons/bs"
import { useTranslation } from "react-i18next"
import { Price, Title, Spinner, Input, ImageEditor, RatingStars } from "../../components"
import { useEffect, useState } from "react"
import { useCommentStatuses, useUploadComment, useUserProducts } from "../../api/api"
import CommentSelectItem from "./CommentSelectItem"
import { BsTrashFill } from "react-icons/bs"
import useInput from "../../hooks/useInput"
import { deleteImage } from "../Sell/utils"
import CommentStatus from "./CommentStatus"

const AddComment = () => {

    const { t } = useTranslation()
    const { profileId } = useParams()
    const products = useUserProducts(profileId, {})
    const statuses = useCommentStatuses()
    const [filteredProducts, setFilteredProducts] = useState(products?.data?.results)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [filterString, setFilterString] = useState('')
    const [statusId, setStatusId] = useState(null)
    const [images, setImages] = useState([])
    const text = useInput('', { isEmpty: true })
    const [rating, setRating] = useState(1)
    const addCommentMutation = useUploadComment()

    const setMainIndex = () => { }

    useEffect(() => {
        setFilteredProducts(products?.data?.results)
    }, [products.data])

    useEffect(() => {
        setFilteredProducts(
            products?.data?.results.filter(el =>
                el.name.toLowerCase().includes(filterString.toLocaleLowerCase()))
        )
    }, [filterString])

    const handleUpload = () => {
        const data = {
            product: selectedProduct.id,
            rate: rating,
            status: statusId,
            images: images,
            text: text.value
        }
        addCommentMutation.mutate(data)
    }

    return (
        <div className="grid gap-3">
            <NavLink className='flex items-center gap-2 hover:text-accent-orange' to={`/users/${profileId}/comments`}>
                <BsArrowLeft />{t('back_to_comments')}
            </NavLink>
            <Title text={t('add_comment')} />
            <div className="grid md:grid-cols-[1fr_2fr] gap-5">
                <h2 className="font-bold text-xl">{t('select_product')}</h2>
                <div className="grid gap-3">
                    {!selectedProduct &&
                        <>
                            <input
                                className="grocket-input w-full md:w-2/3 lg:w-1/2"
                                placeholder={t('type_to_filter')}
                                onChange={(e) => setFilterString(e.target.value)}
                            />
                            {products.isLoading && <Spinner />}
                            {products.error && error.message}
                            <div className="flex flex-wrap gap-3">
                                {
                                    filteredProducts?.map((el, key) =>
                                        <CommentSelectItem
                                            key={key}
                                            item={el}
                                            onClick={() => setSelectedProduct(el)}
                                            selectable
                                        />)
                                }
                            </div>
                        </>
                    }
                    {selectedProduct &&
                        <div className="flex items-center gap-5">
                            <CommentSelectItem item={selectedProduct} />
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className='text-accent-red'
                            >
                                <BsTrashFill />
                            </button>
                        </div>
                    }

                </div>
                {
                    selectedProduct &&
                    <>
                        <h2 className="font-bold text-xl">{t('status')}</h2>
                        <div className="grid gap-2">
                            {
                                statuses.data && statuses.data?.map((el, key) =>
                                    <div className="flex item-center gap-5">
                                        <input
                                            type='radio'
                                            key={key}
                                            name="comment-status"
                                            id={el.name}
                                            onChange={() => setStatusId(el.id)}
                                        />
                                        <label
                                            htmlFor={el.name}
                                            className='flex items-center gap-1.5'
                                        >
                                            <CommentStatus
                                                title={el.title}
                                                name={el.name}
                                            />
                                        </label>
                                    </div>
                                )
                            }
                        </div>
                    </>
                }
                {
                    statusId &&
                    <>
                        <h2 className="font-bold text-xl col-span-full">{t('info')}</h2>
                        <Input
                            instance={text}
                            title={t('text')}
                            must
                            large
                            autoRef
                            split
                            deleteBtn={false}
                        />
                        <ImageEditor
                            images={images}
                            setImages={setImages}
                        />
                        <div className="flex flex-col gap-3">
                            <p className="font-bold text-lg">{t('list_of_comment_images')}</p>
                            <p className="text-green-500">{t('images_are_optional')}</p>
                            <div className='col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 h-fit'>
                                {images.map((el, key) =>
                                    <div key={key} className='w-full p-2 rounded-lg border-2 grid gap-2'>
                                        <img className='w-full' src={el.image} />
                                        <button
                                            type='button'
                                            onClick={() => deleteImage(key, images, setMainIndex, setImages)}
                                            className='text-accent-red'>
                                            <BsTrashFill />
                                        </button>
                                    </div>)}
                            </div>
                        </div>
                        <div className="col-span-full">
                            <h2 className="font-bold text-xl mb-1">{t('rating')}</h2>
                            <RatingStars rating={rating} setRating={setRating} />
                        </div>
                        <button
                            className="button-fill-orange"
                            onClick={handleUpload}
                            disabled={text.value === ''}
                        >
                            {t('upload')}
                        </button>
                    </>
                }
            </div>
        </div>
    )
}

export default AddComment