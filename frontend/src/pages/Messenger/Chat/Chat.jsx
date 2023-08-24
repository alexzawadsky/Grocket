import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Message from './Message'
import MessengerContext from '../../../contexts/MessengerContext'
import ChatLoading from './ChatLoading'
import MessagesSuggestions from './MessagesSuggestions'
import { useChatMessages } from '../../../api/api'
import ChatEndMarker from './ChatEndMarker'
import LoadMoreMarker from './LoadMoreMarker'
import ChatMessageForm from '../../../forms/ChatMessageForm'
import ChatHeader from './ChatHeader'

const Chat = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { chatId } = useParams()
    const [replyTo, setReplyTo] = useState(null)
    const [onBottom, setOnBottom] = useState(true)
    const chatRef = useRef()
    const { getChatById, chatsLoading } = useContext(MessengerContext)
    const chat = getChatById(parseInt(chatId))
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useChatMessages(parseInt(chatId))

    useEffect(() => {
        onBottom && scrollToBottom()
    }, [chat?.messages?.length])

    const scrollToBottom = () => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)

        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [])

    const handleKeyPress = (event) => {
        if (event.key === 'Escape') {
            navigate('/messenger')
        }
    }

    return (
        <div className="flex h-full max-h-[calc(100dvh-4rem-2.5rem)] min-h-[calc(100dvh-4rem-2.5rem)] w-full flex-col rounded-lg border p-3 shadow-lg dark:border-2 dark:border-zinc-600">
            <ChatHeader chat={chat} />
            {!chat && <ChatLoading chatsLoading={chatsLoading} />}
            {chat && (
                <ul
                    className="chat-container mb-3 mt-auto flex grow flex-col-reverse gap-2 overflow-y-auto scroll-smooth pt-3"
                    ref={chatRef}
                >
                    <ChatEndMarker setOnBottom={setOnBottom} />
                    {data?.pages?.map((page, i) => (
                        <React.Fragment key={i}>
                            {page.data?.results.map((message, key) => (
                                <li key={key}>
                                    <Message
                                        message={message}
                                        setReplyTo={setReplyTo}
                                    />
                                </li>
                            ))}
                        </React.Fragment>
                    ))}
                    <LoadMoreMarker
                        hasNextPage={hasNextPage}
                        isFetching={isFetchingNextPage}
                        fetch={fetchNextPage}
                        error={error}
                    />
                </ul>
            )}
            {chat?.messages?.length === 0 && !isFetching && (
                <MessagesSuggestions chatId={chatId} />
            )}
            <ChatMessageForm
                chat={chat}
                onBottom={onBottom}
                replyTo={replyTo}
                scrollToBottom={scrollToBottom}
                setReplyTo={setReplyTo}
            />
        </div>
    )
}

export default Chat
