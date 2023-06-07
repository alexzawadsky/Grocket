import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { ReadMore } from '../../../components'
import { Button, PublishTime, RatingStars } from '../../../components/ui'
import AuthContext from '../../../contexts/AuthProvider'
import { SlideshowLightbox } from 'lightbox.js-react'
import 'lightbox.js-react/dist/index.css'
import CommentStatus from './CommentStatus'
import { BsTrash } from 'react-icons/bs'
import CommentReply from './CommentReply'
import { useDeleteComment } from '../../../api/api'

const Comment = ({ comment }) => {
    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const deleteProductMutation = useDeleteComment()

    return (
        <div className="flex h-full flex-col gap-1 rounded-lg border p-5 shadow dark:border-2 dark:border-zinc-600">
            <div className="flex items-center justify-between">
                <Link
                    className="text-lg font-bold hover:text-accent-orange"
                    aria-label="comment author"
                    to={`/users/${comment?.user?.id}`}
                >
                    {comment?.user?.first_name} {comment?.user?.last_name}
                </Link>
                {comment?.user?.id === user?.user_id && (
                    <Button
                        ariaLabel="delete comment"
                        border={false}
                        className="text-accent-red"
                        onClick={() =>
                            deleteProductMutation.mutate(comment?.id)
                        }
                    >
                        <BsTrash />
                    </Button>
                )}
            </div>
            <p
                className="text-sm text-primary-300 dark:text-slate-400"
                aria-label="comment publication time"
            >
                <PublishTime pubDate={comment?.pub_date} />
            </p>
            <RatingStars rating={comment?.rate} />
            <div className="line-clamp-1 flex items-center gap-1 text-sm font-bold text-zinc-500 dark:text-slate-400">
                <CommentStatus
                    title={comment?.status?.title}
                    name={comment?.status?.name}
                />
                <p className="line-clamp-1">
                    {' '}
                    -{' '}
                    {comment?.product ? (
                        <Link
                            className=" hover:text-accent-orange"
                            to={`/products/${comment?.product?.slug}`}
                        >
                            {comment?.product?.name}
                        </Link>
                    ) : (
                        <span className="text-accent-red">DELETED</span>
                    )}
                </p>
            </div>
            <ReadMore text={comment?.text} limit={100} />
            {comment?.images.length ? (
                <SlideshowLightbox
                    theme="lightbox"
                    className="mt-2 grid grow grid-cols-4 items-start gap-2 md:grid-cols-5 xl:grid-cols-6"
                >
                    {comment?.images.map((el, key) => (
                        <img
                            key={key}
                            src={el.image}
                            className="aspect-auto rounded-lg border-2 dark:border-zinc-600"
                            alt={`comment photo ${key + 1}`}
                        />
                    ))}
                </SlideshowLightbox>
            ) : null}
            <CommentReply
                commentId={comment?.id}
                seller={comment?.seller}
                reply={comment?.reply}
            />
        </div>
    )
}

export default Comment
