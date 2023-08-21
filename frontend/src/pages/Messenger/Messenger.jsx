import React, { useContext } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Chat from './Chat'
import { useTranslation } from 'react-i18next'
import useScreen from '../../hooks/useScreen'
import MessengerContext from '../../contexts/MessengerContext'
import NoChatPlaceholder from './NoChatPlaceholder'
import ChatsList from './ChatsList'
import { Title } from '../../components/ui'
import { parse } from 'twemoji-parser'
import logo from '../../assets/images/logo.png'

const Messenger = () => {
    const { t } = useTranslation()
    const { chats } = useContext(MessengerContext)
    const location = useLocation()
    const { isMinTablet } = useScreen()
    const iconLink = parse('📯')[0]?.url

    return (
        <div className="grid max-h-[calc(100dvh-4rem-1.25rem)] min-h-[calc(100dvh-4rem-1.25rem)] gap-5 md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr]">
            {(isMinTablet || location.pathname === '/messenger') && (
                <ChatsList />
            )}
            <Routes>
                <Route path=":chatId" element={<Chat />} />
                <Route
                    path=""
                    element={isMinTablet ? <NoChatPlaceholder /> : null}
                />
            </Routes>
        </div>
    )
}

export default Messenger
