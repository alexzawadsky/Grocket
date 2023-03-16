import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';

const ReadMore = ({ text }) => {

    const { t } = useTranslation()
    const [isReadMore, setIsReadMore] = useState(true);
    const long = text.length > 150

    return (
        <p className="text">
            {long && isReadMore ? text.slice(0, 150) : text}
            {long ? <span onClick={() => setIsReadMore(prevState => !prevState)} className="text-accent-orange cursor-pointer">
                {isReadMore ? t('read_more') : t('read_less')}
            </span> : null}
        </p>
    );
};

export default ReadMore