import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';

const ReadMore = ({ text, limit }) => {

    const { t } = useTranslation()
    const [isReadMore, setIsReadMore] = useState(true);
    const long = text.length > limit

    return (
        <div className="">
            {long && isReadMore ?
                <p dangerouslySetInnerHTML={{ __html: text.slice(0, limit).replace(/\n/g, "<br>") }}></p>
                :
                <p dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}></p>}
            {long ? <span onClick={() => setIsReadMore(prevState => !prevState)} className="text-accent-orange cursor-pointer">
                {isReadMore ? `${t('read_more')}...` : t('read_less')}
            </span> : null}
        </div>
    );
};

export default ReadMore