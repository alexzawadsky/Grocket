import React from 'react'
import { useTranslation } from 'react-i18next'
import { parse } from 'twemoji-parser'

const ChatLoading = ({ chatsLoading }) => {
    const mailIconLink = parse('✉️')[0]?.url
    const notFoundIconLink = parse('❓')[0]?.url
    const { t } = useTranslation()

    return (
        <div className="relative mb-3 grow">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {chatsLoading ? (
                    <>
                        <img src={mailIconLink} className="animate-spinmail" />
                        <p className="mt-3 font-bold">{t('loading')}...</p>
                    </>
                ) : (
                    <>
                        <img
                            src={notFoundIconLink}
                            style={{
                                filter: 'hue-rotate(33deg) brightness(1.5)',
                            }}
                        />
                        <p className="mt-3 font-bold">{t('chat_not_found')}</p>
                    </>
                )}
            </span>
        </div>
    )
}

export default ChatLoading
