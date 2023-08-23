import { Route, Routes, useLocation } from 'react-router-dom'
import Chat from './Chat/Chat'
import useScreen from '../../hooks/useScreen'
import NoChatPlaceholder from './Chat/NoChatPlaceholder'
import ChatsList from './ChatsList/ChatsList'

const Messenger = () => {
    const { isMinTablet } = useScreen()
    const location = useLocation()

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
