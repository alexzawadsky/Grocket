import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const ReadMore = ({ text, limit }) => {
    const { t } = useTranslation()
    const [isReadMore, setIsReadMore] = useState(true)
    const long = text.length > limit
    const res = text
        .slice(0, long && isReadMore ? limit : text.length)
        .replace(/\n/g, '<br>')

    return (
        <div aria-label="read more container">
            <p dangerouslySetInnerHTML={{ __html: res }} aria-label="text"></p>
            {long && (
                <span
                    aria-label="read more toggle"
                    onClick={() => setIsReadMore((prevState) => !prevState)}
                    className="cursor-pointer text-accent-orange"
                >
                    {isReadMore ? `${t('read_more')}...` : t('read_less')}
                </span>
            )}
        </div>
    )
}

export default ReadMore
