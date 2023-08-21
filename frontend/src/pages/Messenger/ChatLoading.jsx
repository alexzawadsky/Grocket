import React from 'react'
import { useTranslation } from 'react-i18next'
import { parse } from 'twemoji-parser'

const ChatLoading = () => {
    const iconLink = parse('✉️')[0]?.url
    const { t } = useTranslation()
    return (
        <div className="relative mb-3 grow">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <img src={iconLink} className="animate-spin" />
                <p className="mt-3 font-bold">{t('loading')}...</p>
            </span>
        </div>
    )
}

export default ChatLoading
