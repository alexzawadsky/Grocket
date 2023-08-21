import { createContext, useState, useEffect, useContext } from 'react'
import useWebSocket from 'react-use-websocket'
import AuthContext from './AuthProvider'

const MessengerContext = createContext()

export default MessengerContext

const chatMock = {
    unread: true,
    id: 1,
    item: {
        name: 'Apple Watch',
        image: 'https://www.dpreview.com/files/p/articles/6857732420/DJI_Mavic_Mini_2.jpeg',
    },
    last_message: {
        user: 2,
        text: 'Hi, is it still available? I would like to buy it today',
        time: '17:23',
    },
    user: {
        id: '5',
        name: 'Alexey Zawadsky',
        image: null,
    },
    item: {
        name: 'DJI Mini 2',
        slug: 'dji-mini-2',
        price: 450,
        image: 'https://www.dpreview.com/files/p/articles/6857732420/DJI_Mavic_Mini_2.jpeg',
    },
}

export const MessengerProvider = ({ children }) => {
    const [chats, setChats] = useState(
        Array(20)
            .fill(0)
            .map(() => chatMock)
    )
    const { user } = useContext(AuthContext)

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(
        `ws://localhost:8000/ws/messenger/notifications/${user?.user_id}/`
    )

    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.message) {
            // setMessages((prevM) => [...prevM, lastJsonMessage])
            console.log(lastJsonMessage)
        }
    }, [lastJsonMessage])

    const sendMessage = (chatId, message) => {
        console.log('send', chatId, message)
    }

    const getChat = (chatId) => {
        return chats.find((chat) => chat?.id == chatId)
    }

    const contextData = {
        chats,
        getChat,
        sendMessage,
    }

    return (
        <MessengerContext.Provider value={contextData}>
            {children}
        </MessengerContext.Provider>
    )
}
