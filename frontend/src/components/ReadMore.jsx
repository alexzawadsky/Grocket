import React, { useState } from 'react'

const ReadMore = ({ text }) => {
    const [isReadMore, setIsReadMore] = useState(true);
    const long = text.length > 150

    return (
        <p className="text">
            {long && isReadMore ? text.slice(0, 150) : text}
            {long ? <span onClick={() => setIsReadMore(prevState => !prevState)} className="text-accent-orange cursor-pointer">
                {isReadMore ? "...read more" : "  read less"}
            </span> : null}
        </p>
    );
};

export default ReadMore