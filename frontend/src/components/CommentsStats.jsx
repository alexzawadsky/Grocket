import React from 'react'
import RatingStars from './RatingStars';

const getAvg = (comments) => {
    let total = 0
    for (const comment of comments) {
        total += comment.rate
    }
    return total / comments.length;
}

const getRateCount = (comments, rate) => {
    return comments.filter(comment => comment.rate === rate).length
}

const StatRow = ({ rate, comments }) => {

    const count = getRateCount(comments, rate)

    return (
        <div className='flex items-center gap-3'>
            <RatingStars rating={rate} />
            <div className='w-full h-2/3 border-2 border-accent-orange/[0.2] rounded-full'>
                <div style={{ width: `${count * 20}%` }} className={`bg-accent-orange h-full rounded-full`}>

                </div>
            </div>
        </div>

    )
}

const CommentsStats = ({ comments }) => {

    const avg = getAvg(comments)

    return (
        <div className='w-full grid gap-3'>
            <div className='flex gap-5 items-center'>
                <p className='font-bold text-2xl'>{avg.toFixed(2)}</p>
                <RatingStars rating={avg} />
            </div>
            <p>Based on {comments.length} comments</p>
            <div className='md:w-2/3 flex flex-col-reverse gap-1'>
                {
                    Array(5).fill(0).map((i, key) => <StatRow key={key} rate={key + 1} comments={comments} />)
                }
            </div>
        </div>
    )
}

export default CommentsStats