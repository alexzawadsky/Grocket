import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Spinner } from '../ui'
import { useTranslateText } from '../../api/api'
import { Link } from 'react-router-dom'
import libretranslateIcon from '../../assets/icons/libretranslate.png'

const ReadMore = ({ text, limit }) => {
    const { t } = useTranslation()
    const [translated, setTranslated] = useState(false)
    const { data, isLoading, error } = useTranslateText(text, translated)
    const [isReadMore, setIsReadMore] = useState(true)
    const long = data?.length > limit
    const res = data
        ? data
              .slice(0, long && isReadMore ? limit : data.length)
              .replace(/\n/g, '<br>')
        : ''

    return (
        <div aria-label="read more container">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0">
                <Button
                    onClick={() => setTranslated((prevState) => !prevState)}
                    border={false}
                    className="text-sm hover:text-accent-orange"
                >
                    {translated ? t('show_original') : t('translate')}
                </Button>
                <Link
                    to="https://libretranslate.com/"
                    target="_blank"
                    className="flex gap-1 text-[12px] text-[#42a5f5] hover:underline"
                >
                    {t('powered_by')}{' '}
                    <img
                        src={libretranslateIcon}
                        className="h-4"
                        alt="libretranslate icon"
                    />{' '}
                    LibreTranslate
                </Link>
            </div>
            {error && t('translation_fail')}
            {isLoading && <Spinner />}
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
