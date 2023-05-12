import { useState } from 'react'

const RatingStars = ({ rating, setRating }) => {
    const [localRating, setLocalRating] = useState(rating)

    return (
        <ul
            className="flex w-fit gap-1"
            onMouseLeave={() => setRating && setLocalRating(rating)}
            aria-label={`rating stars ${rating} out of 5`}
        >
            {Array(5)
                .fill(0)
                .map((_, i) => (
                    <li
                        key={i}
                        style={
                            setRating
                                ? {
                                    color:
                                        i + 1 <= localRating + 0.3
                                            ? '#FF9001'
                                            : i + 1 <= rating
                                                ? '#ffd8a6'
                                                : '#C0D6E4',
                                }
                                : {
                                    color:
                                        i + 1 <= rating + 0.3
                                            ? '#FF9001'
                                            : '#C0D6E4',
                                }
                        }
                        className={setRating ? 'cursor-pointer text-3xl' : ''}
                        onMouseEnter={() =>
                            setRating ? setLocalRating(i + 1) : null
                        }
                        onClick={() => setRating(i + 1)}
                        aria-hidden="true"
                    >
                        &#9733;
                    </li>
                ))}
        </ul>
    )
}

export default RatingStars
