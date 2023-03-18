import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { PublishTime, RatingStars, ReadMore } from '../../components'
import AuthContext from '../../contexts/AuthProvider'
import { SlideshowLightbox } from "lightbox.js-react"
import 'lightbox.js-react/dist/index.css'
import CommentStatus from './CommentStatus'

const Comment = ({ comment }) => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)

    return (
        <div className='border-2 border-black rounded-lg p-5 flex flex-col gap-1'>
            <p className='font-bold text-lg'>{comment?.user?.first_name} {comment?.user?.last_name}</p>
            <p className='text-sm text-primary-300'><PublishTime pubDate={comment?.pub_date} /></p>

            <RatingStars rating={comment?.rating} />
            <div className="flex gap-1 items-center">
                <p className='text-primary-300/[0.8] text-sm font-bold flex items-center gap-1.5'><CommentStatus title={comment?.status?.title} name={comment?.status?.name} /> - </p>
                <NavLink
                    className='text-primary-300/[0.8] text-sm font-bold hover:text-accent-orange'
                    to={`/products/${comment?.product?.id}`}
                >
                    {comment?.product?.name}
                </NavLink>

                {/* <p className='text-sm text-primary-300'><strong>{t('status')}:</strong> </p> */}
            </div>
            <div className="grow">
                <ReadMore text={comment?.text} limit={100} />
            </div>
            <SlideshowLightbox theme='lightbox' className='grid mt-2 grid-cols-4 md:grid-cols-5 xl:grid-cols-6 items-center gap-2'>
                {comment?.images.map((el, key) => <img key={key} src={el.image} className='border-2 rounded-xl aspect-auto' />)}
            </SlideshowLightbox>
        </div>
    )
}

export default Comment