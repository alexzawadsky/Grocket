import React, { useState } from 'react'

const ReadMore = ({ text }) => {
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p className="text">
            {isReadMore ? text.slice(0, 150) : text}
            <span onClick={toggleReadMore} className="text-accent-orange cursor-pointer">
                {isReadMore ? "...read more" : "  read less"}
            </span>
        </p>
    );
};

export default ReadMore