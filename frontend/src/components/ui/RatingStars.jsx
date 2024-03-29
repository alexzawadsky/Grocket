import { useContext, useState } from 'react'
import ThemeContext from '../../contexts/ThemeContext'

const RatingStars = ({ rating, setRating }) => {
    const [localRating, setLocalRating] = useState(rating)
    const { isDark } = useContext(ThemeContext)

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
                                              ? 'var(--primary)'
                                              : i + 1 <= rating
                                              ? '#ffd8a6'
                                              : isDark
                                              ? '#747b80'
                                              : '#C0D6E4',
                                  }
                                : {
                                      color:
                                          i + 1 <= rating + 0.3
                                              ? 'var(--primary)'
                                              : isDark
                                              ? '#747b80'
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
