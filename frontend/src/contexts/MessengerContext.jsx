import { createContext, useState, useEffect, useContext } from 'react'
import useWebSocket from 'react-use-websocket'
import AuthContext from './AuthProvider'
import { useChats, useSendMessageMutation } from '../api/api'
import { useQueryClient } from '@tanstack/react-query'
import {
    addNewChat,
    addNewMessage,
    deleteChat,
    updateLastMessageInChatList,
} from '../handlers/ws'

const MessengerContext = createContext()

export default MessengerContext

export const MessengerProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const { data: chats, isLoading: chatsLoading, error } = useChats()
    const sendMessageMutation = useSendMessageMutation()
    const queryClient = useQueryClient()

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(
        `ws://${
            import.meta.env.VITE_WS_HOST || 'localhost'
        }/ws/messenger/notifications/${user?.user_id}/`
    )

    useEffect(() => {
        console.log(lastJsonMessage)
        if (lastJsonMessage && lastJsonMessage.action) {
            switch (lastJsonMessage.action) {
                case 'messages__new':
                    addNewMessage(lastJsonMessage?.data, queryClient)
                    updateLastMessageInChatList(
                        lastJsonMessage?.data,
                        queryClient
                    )
                    break
                case 'chats__new':
                    addNewChat(lastJsonMessage?.data, queryClient)
                    break
                case 'chats__delete':
                    deleteChat(lastJsonMessage?.data?.id, queryClient)
                    break
            }
        }
    }, [lastJsonMessage])

    const sendMessage = (chatId, message) => {
        sendMessageMutation.mutate({ chatId, message })
    }

    const getChats = () => {
        if (!chats) return []
        const compareChats = (chatA, chatB) => {
            const lastMessageTimeA = new Date(chatA.last_message?.pub_date)
            const lastMessageTimeB = new Date(chatB.last_message?.pub_date)
            return lastMessageTimeB - lastMessageTimeA
        }
        chats.sort(compareChats)
        return chats
    }

    const getChatById = (chatId) => {
        return chats?.find((chat) => chat?.id == chatId)
    }

    const contextData = {
        getChats,
        getChatById,
        chatsLoading,
        sendMessage,
    }

    return (
        <MessengerContext.Provider value={contextData}>
            {children}
        </MessengerContext.Provider>
    )
}
