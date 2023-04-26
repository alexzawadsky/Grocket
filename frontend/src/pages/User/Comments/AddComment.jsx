import { NavLink, useParams } from "react-router-dom"
import { BsArrowLeft } from "react-icons/bs"
import { useTranslation } from "react-i18next"
import { Title, Spinner, Input, ImageEditor, RatingStars, Button, Form } from "../../../components/ui"
import { useEffect, useState } from "react"
import { useCommentStatuses, useUploadComment, useUserProducts } from "../../../api/api"
import CommentSelectItem from "./CommentSelectItem"
import { BsTrashFill } from "react-icons/bs"
import useInput from "../../../hooks/useInput"
import { deleteImage } from "../../Sell/utils"
import CommentStatus from "../CommentStatus"

const AddComment = () => {

    const { t } = useTranslation()
    const { profileId } = useParams()
    const products = useUserProducts(profileId, { for_comments: true })
    const statuses = useCommentStatuses()
    const [filteredProducts, setFilteredProducts] = useState(products?.data?.results)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const filterString = useInput('')
    const [statusId, setStatusId] = useState(null)
    const [images, setImages] = useState([])
    const text = useInput('', {})
    const [rating, setRating] = useState(1)
    const addCommentMutation = useUploadComment()

    useEffect(() => {
        setFilteredProducts(products?.data?.results)
    }, [products.data])

    useEffect(() => {
        setFilteredProducts(
            products?.data?.results.filter(el =>
                el.name.toLowerCase().includes(filterString.value.toLocaleLowerCase()))
        )
    }, [filterString.value])

    const handleUpload = () => {
        addCommentMutation.mutate({
            product: selectedProduct.id,
            rate: rating,
            status: statusId,
            images: images,
            text: text.value
        })
    }

    return (
        <div className="grid gap-3">
            <NavLink className='flex items-center gap-2 hover:text-accent-orange' to={`/users/${profileId}/comments`}>
                <BsArrowLeft />{t('back_to_comments')}
            </NavLink>
            <Title text={t('add_comment')} />
            <Form className="grid md:grid-cols-[1fr_2fr] gap-5" onSubmit={handleUpload}>
                <h2 className="font-bold text-xl">{t('select_product')}</h2>
                <div className="grid gap-3">
                    {!selectedProduct && <>
                        <Input
                            instance={filterString}
                            className="w-full md:w-2/3 lg:w-1/2"
                            placeholder={t('type_to_filter')}
                            onChange={(e) => setFilterString(e.target.value)}
                        />
                        {products.isLoading && <Spinner />}
                        {products.error && error.message}
                        <ul className="flex flex-wrap gap-3">
                            {
                                filteredProducts?.map((el, key) => <li key={key}>
                                    <CommentSelectItem
                                        item={el}
                                        onClick={() => setSelectedProduct(el)}
                                        selectable
                                    />
                                </li>)
                            }
                        </ul>
                    </>
                    }
                    {selectedProduct &&
                        <div className="flex items-center gap-5">
                            <CommentSelectItem item={selectedProduct} />
                            <Button
                                type='button'
                                onClick={() => setSelectedProduct(null)}
                                className='text-accent-red'
                                border={false}
                            >
                                <BsTrashFill />
                            </Button>
                        </div>}
                </div>
                {selectedProduct && <>
                    <h2 className="font-bold text-xl">{t('status')}</h2>
                    <ul className="grid gap-1 p-1 rounded-xl border dark:border-2 dark:border-zinc-600 shadow-sm   grid-cols-[1fr_1fr] w-fit">
                        {statuses.data && statuses.data?.map((el, key) => <li key={key}>
                            <Button
                                type='button'
                                className={`h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 px-2 flex items-center font-bold cursor-pointer gap-2 ${el?.id === statusId && '!bg-slate-200 dark:!bg-zinc-700'} !justify-start !rounded-lg`}
                                onClick={() => setStatusId(el?.id)}
                                width='full'
                                border={false}
                            >
                                <CommentStatus
                                    title={el?.title}
                                    name={el?.name}
                                />
                            </Button>
                        </li>)}
                    </ul>
                </>
                }
                {
                    statusId && selectedProduct &&
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
                            <ul className='col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 h-fit'>
                                {images.map((el, key) =>
                                    <li key={key} className='w-full p-2 rounded-lg border-2 dark:border-zinc-600 grid gap-2'>
                                        <img className='w-full' src={el?.image} />
                                        <button
                                            type='button'
                                            onClick={() => deleteImage(key, images, setMainIndex, setImages)}
                                            className='text-accent-red'>
                                            <BsTrashFill />
                                        </button>
                                    </li>)}
                            </ul>
                        </div>
                        <div className="col-span-full">
                            <h2 className="font-bold text-xl mb-1">{t('rating')}</h2>
                            <RatingStars rating={rating} setRating={setRating} />
                        </div>
                        <Button
                            style='fill'
                            color='accent-orange'
                            type='submit'
                            height={12}
                            width='fit'
                            px={5}
                            disabled={text.value === ''}
                        >
                            {t('upload')}
                        </Button>
                    </>
                }
            </Form>
        </div>
    )
}

export default AddComment