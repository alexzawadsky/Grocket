import React from 'react'
import {
    Link,
    Route,
    Routes,
    useLocation,
    useOutlet,
    useParams,
} from 'react-router-dom'
import Chat from './Chat'
import { useTranslation } from 'react-i18next'
import ChatLink from './ChatLink'
import useScreen from '../../hooks/useScreen'

const Messenger = () => {
    const { t } = useTranslation()
    const outlet = useOutlet()
    const location = useLocation()
    const { isMinTablet } = useScreen()
    const chat = {
        unread: true,
        id: '1',
        item: {
            name: 'Apple Watch',
            image: 'https://www.dpreview.com/files/p/articles/6857732420/DJI_Mavic_Mini_2.jpeg',
        },
        user: {
            name: 'Alex Zawadsky',
            image: null,
        },
        last_message: {
            user: 2,
            text: 'Hi, is it still available? I would like to buy it today',
            time: '17:23',
        },
    }
    return (
        <div className="grid gap-5 md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr]">
            {(isMinTablet || location.pathname === '/messenger') && (
                <div>
                    <h1 className="pb-3 text-3xl font-bold">
                        {t('messenger')}
                    </h1>
                    <ul className="grid gap-2 overflow-y-auto">
                        {Array(15)
                            .fill(0)
                            .map((el, key) => (
                                <ChatLink
                                    key={key}
                                    chat={{ ...chat, id: key.toString() }}
                                />
                            ))}
                    </ul>
                </div>
            )}
            <Routes>
                <Route path=":chatId" element={<Chat />} />
                <Route path="" element={null} />
            </Routes>
        </div>
    )
}

export default Messenger
