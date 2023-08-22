import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Flag, Form, Input, Price } from '../../components/ui'
import useInput from '../../hooks/useInput'
import { IoSend, IoCloseOutline } from 'react-icons/io5'
import { IoIosArrowDown } from 'react-icons/io'
import { useTranslation } from 'react-i18next'
import { MdImage } from 'react-icons/md'
import Message from './Message'
import { RxDotFilled, RxDot } from 'react-icons/rx'
import useScreen from '../../hooks/useScreen'
import AuthContext from '../../contexts/AuthProvider'
import MessengerContext from '../../contexts/MessengerContext'
import ChatLoading from './ChatLoading'
import MessagesSuggestions from './MessagesSuggestions'

const Chat = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { chatId } = useParams()
    const message = useInput()
    const online = true
    const { isMinTablet } = useScreen()
    const { user } = useContext(AuthContext)
    const [onBottom, setOnBottom] = useState(true)
    const chatRef = useRef()
    const bottomMarkerRef = useRef()
    const { sendMessage, getChatById } = useContext(MessengerContext)
    const chat = getChatById(parseInt(chatId))

    useEffect(() => {
        onBottom && scrollToBottom()
    }, [chat?.messages?.length])

    const scrollToBottom = () => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }

    const handleSend = () => {
        if (message.value.trim() === '') return
        const messageObj = {
            message: message.value,
        }
        sendMessage(chatId, messageObj)
        message.setValue('')
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)
        const callback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setOnBottom(true)
                } else {
                    setOnBottom(false)
                }
            })
        }

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.0,
        }
        const observer = new IntersectionObserver(callback, options)

        if (bottomMarkerRef.current) {
            observer.observe(bottomMarkerRef.current)
        }

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
            observer.disconnect()
        }
    }, [])

    const handleKeyPress = (event) => {
        if (event.key === 'Escape') {
            navigate('/messenger')
        }
    }

    const onlineSymbol = online ? <RxDotFilled color="#008000" /> : <RxDot />

    return (
        <div className="flex h-full max-h-[calc(100dvh-4rem-2.5rem)] min-h-[calc(100dvh-4rem-2.5rem)] w-full flex-col rounded-lg border p-3 shadow-lg dark:border-2 dark:border-zinc-600">
            <div className="flex justify-between gap-2 border-b pb-3 dark:border-b-2 dark:border-zinc-600 max-lg:flex-col max-lg:gap-3">
                <div className="flex gap-2">
                    <Link to="/messenger" className="my-auto">
                        <IoCloseOutline size={25} />
                    </Link>
                    {chat && (
                        <>
                            <Link
                                to={`/users/${chat?.user?.id}`}
                                className="flex items-center gap-1 hover:text-accent-orange md:gap-3"
                            >
                                <Avatar
                                    avatar={chat?.user?.avatar}
                                    width={30}
                                />
                                <p className="flex items-center md:text-lg">
                                    {!isMinTablet && onlineSymbol}{' '}
                                    {chat?.user?.first_name}{' '}
                                    {isMinTablet
                                        ? chat?.user?.last_name
                                        : `${chat?.user?.last_name[0]}.`}
                                </p>
                                <Flag
                                    country={chat?.user?.country}
                                    width={20}
                                />
                            </Link>
                            <span className="hidden items-center md:flex">
                                {onlineSymbol}
                                {isMinTablet && online
                                    ? t('online')
                                    : t('offline')}
                            </span>
                        </>
                    )}
                </div>
                {chat && (
                    <Link
                        to={`/products/${chat?.product?.slug}`}
                        className="flex w-fit items-center gap-3 hover:text-accent-orange max-md:text-sm"
                    >
                        <img
                            src={chat?.product?.image?.image}
                            className="w-10 rounded-md"
                        />
                        {chat?.product?.name} -{' '}
                        <Price price={chat?.product?.price} text />
                    </Link>
                )}
            </div>
            {!chat && <ChatLoading />}
            {chat && (
                <ul
                    className="chat-container mb-3 mt-auto grid grow gap-2 overflow-y-auto scroll-smooth"
                    ref={chatRef}
                >
                    {chat?.messages &&
                        chat.messages.map((message, key) => (
                            <Message key={key} message={message} />
                        ))}
                    <span ref={bottomMarkerRef} className="h-[1px]"></span>
                </ul>
            )}
            {!chat?.messages?.length ? (
                <MessagesSuggestions chatId={chatId} />
            ) : null}
            <Form className="relative flex gap-3" onSubmit={handleSend}>
                <Input
                    instance={message}
                    containerClassName="w-full min-w-0"
                    autoRef
                />
                <Button
                    style="outline"
                    type="button"
                    className="dark:hover:border-400 aspect-square h-10 w-10 !rounded-full  border-slate-500 text-slate-500 hover:bg-slate-100 dark:!border-2 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:text-zinc-400"
                    onClick={handleSend}
                    disabled={!chat}
                >
                    <MdImage size={20} />
                </Button>
                <Button
                    style="fill"
                    type="button"
                    color="accent-orange"
                    className="aspect-square h-10 w-10 hover:drop-shadow-md"
                    onClick={handleSend}
                    disabled={!chat}
                >
                    <IoSend />
                </Button>
                {!onBottom && chat && (
                    <Button
                        className="dark:hover:border-400 absolute -top-12 right-0 aspect-square h-10 w-10 !rounded-full !border border-slate-500  bg-white text-slate-500 hover:bg-slate-100 dark:!border-2 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:text-zinc-400"
                        onClick={scrollToBottom}
                    >
                        <IoIosArrowDown />
                    </Button>
                )}
            </Form>
        </div>
    )
}

export default Chat
