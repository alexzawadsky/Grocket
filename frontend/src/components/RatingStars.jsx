import { useState } from 'react'

const RatingStars = ({ rating, setRating }) => {

    const [localRating, setLocalRating] = useState(rating)

    return (
        <div
            className='flex gap-1 w-fit'
            onMouseLeave={() => setLocalRating(rating)}
        >
            {Array(5).fill(0).map((_, i) => (
                <div
                    key={i}
                    style={{
                        color: i + 1 <= localRating + 0.3 ?
                            '#FF9001'
                            : i + 1 <= rating ? '#ffd8a6' : '#C0D6E4',
                    }}
                    className={setRating && 'cursor-pointer text-3xl'}
                    onMouseEnter={() => setRating ? setLocalRating(i + 1) : null}
                    onClick={() => setRating(i + 1)}
                >
                    &#9733;
                </div>
            ))}
        </div>
    )
}

export default RatingStars