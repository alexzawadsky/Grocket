import React from 'react'
import RatingStars from './RatingStars'

const Comment = ({ content }) => {
    return (
        <div className='border-2 border-black rounded-lg p-5 flex flex-col gap-3'>
            <p className='font-bold text-lg'>{content.author.name} {content.author.last_name}</p>
            <p className='text-primary-300/[0.8]'>Posted on {content.pub_date}</p>
            <p className='grow'>{content.text}</p>
            <RatingStars rating={content.rate} />
        </div>
    )
}

export default Comment