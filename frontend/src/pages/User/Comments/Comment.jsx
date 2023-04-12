import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useParams } from 'react-router-dom'
import { ReadMore } from '../../../components'
import { PublishTime, RatingStars } from '../../../components/ui'
import AuthContext from '../../../contexts/AuthProvider'
import { SlideshowLightbox } from "lightbox.js-react"
import 'lightbox.js-react/dist/index.css'
import CommentStatus from '../CommentStatus'
import { BsTrash } from 'react-icons/bs'
import CommentReply from './CommentReply'
import { useDeleteComment } from '../../../api/api'

const Comment = ({ comment }) => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const deleteProductMutation = useDeleteComment()

    return (
        <div className='shadow border rounded-lg p-5 flex flex-col gap-1'>
            <div className="flex items-center justify-between">
                <p className='font-bold text-lg'>{comment?.user?.first_name} {comment?.user?.last_name}</p>
                {comment?.user?.id === user?.user_id &&
                    <button
                        className='text-accent-red'
                        onClick={() => deleteProductMutation.mutate(comment?.id)}
                    >
                        <BsTrash />
                    </button>}
            </div>
            <p className='text-sm text-primary-300 dark:text-slate-400'><PublishTime pubDate={comment?.pub_date} /></p>
            <RatingStars rating={comment?.rate} />
            <div className="flex gap-1 items-center">
                <p className='text-primary-300/[0.8] dark:text-slate-400 text-sm font-bold flex items-center gap-1.5'><CommentStatus title={comment?.status?.title} name={comment?.status?.name} /> - </p>
                <NavLink
                    className='text-primary-300/[0.8] dark:text-slate-400 text-sm font-bold hover:text-accent-orange'
                    to={`/products/${comment?.product?.id}`}
                >
                    {comment?.product?.name}
                </NavLink>
            </div>
            <div className="">
                <ReadMore text={comment?.text} limit={100} />
            </div>
            <SlideshowLightbox theme='lightbox' className='grid mt-2 grid-cols-4 md:grid-cols-5 xl:grid-cols-6 items-start gap-2 grow'>
                {comment?.images.map((el, key) => <img key={key} src={el.image} className='border-2 rounded-lg aspect-auto dark:border-zinc-600' />)}
            </SlideshowLightbox>
            <CommentReply
                commentId={comment?.id}
                seller={comment?.seller}
                reply={comment?.reply}
            />
        </div>
    )
}

export default Comment