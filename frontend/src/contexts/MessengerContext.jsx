import { createContext, useState, useEffect, useContext } from 'react'
import useWebSocket from 'react-use-websocket'
import AuthContext from './AuthProvider'
import { useChats, useSendMessageMutation } from '../api/api'

const MessengerContext = createContext()

export default MessengerContext

export const MessengerProvider = ({ children }) => {
    const [chats, setChats] = useState([])
    const { user } = useContext(AuthContext)
    const { data, isLoading, error } = useChats()
    const sendMessageMutation = useSendMessageMutation()

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(
        `ws://localhost:8000/ws/messenger/notifications/${user?.user_id}/`
    )

    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.message) {
            // setMessages((prevM) => [...prevM, lastJsonMessage])
            console.log(lastJsonMessage)
        }
    }, [lastJsonMessage])

    useEffect(() => {
        if (data) setChats(data)
    }, [data])

    const sendMessage = (chatId, message) => {
        sendMessageMutation.mutate({ chatId, message })
    }

    const getChats = () => {
        const compareChats = (chatA, chatB) => {
            const lastMessageTimeA = new Date(
                chatA.messages[chatA.messages.length - 1].pub_date
            )
            const lastMessageTimeB = new Date(
                chatB.messages[chatB.messages.length - 1].pub_date
            )
            return lastMessageTimeB - lastMessageTimeA
        }
        chats.sort(compareChats)
        return chats
    }

    const getChatById = (chatId) => {
        return chats.find((chat) => chat?.id == chatId)
    }

    const contextData = {
        getChats,
        getChatById,
        sendMessage,
    }

    return (
        <MessengerContext.Provider value={contextData}>
            {children}
        </MessengerContext.Provider>
    )
}
