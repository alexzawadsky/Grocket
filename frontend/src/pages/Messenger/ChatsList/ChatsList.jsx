import React, { useContext } from 'react'
import MessengerContext from '../../../contexts/MessengerContext'
import ChatLink from './ChatLink'

const ChatsList = () => {
    const { getChats } = useContext(MessengerContext)
    const chats = getChats()

    return (
        <ul className="flex max-h-[calc(100dvh-2.25rem-48px-1.25rem)] min-h-[calc(100dvh-5.25rem-48px-1.25rem)] flex-col gap-2 overflow-y-auto">
            {chats.map((chat) => (
                <ChatLink key={chat?.id} chat={chat} />
            ))}
        </ul>
    )
}

export default ChatsList
