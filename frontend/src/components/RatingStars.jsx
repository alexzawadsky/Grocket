import React from 'react'

const RatingStars = ({ rating }) => {
    return (
        <div className='flex gap-1'>
            {[...Array(5)].map((n, i) => (
                <div
                    key={i}
                    style={{
                        color: i + 1 <= rating + 0.3 ? '#FF9001' : '#C0D6E4',
                    }}
                >
                    &#9733;
                </div>
            ))}
            <p className='pl-2'>{rating}/5</p>
        </div>
    )
}

export default RatingStars