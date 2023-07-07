import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Input, Price } from '../../components/ui'
import useInput from '../../hooks/useInput'
import { IoSend, IoCloseOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { MdImage } from 'react-icons/md'
import Message from './Message'
import { RxDotFilled, RxDot } from 'react-icons/rx'
import useScreen from '../../hooks/useScreen'

const Chat = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { chatId } = useParams()
    const message = useInput()
    const online = true
    const { isMinTablet } = useScreen()

    const data = {
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

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress)

        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [])

    const handleKeyPress = (event) => {
        if (event.key === 'Escape') {
            navigate('/messenger')
        }
    }

    const handleSend = () => {
        const m = message.value
        message.setValue('')
        alert(m)
    }

    const onlineSymbol = online ? <RxDotFilled color="	#008000" /> : <RxDot />

    return (
        <div>
            <div className="sticky top-[84px] flex h-full max-h-[calc(100dvh-4rem-2.5rem)] flex-col rounded-lg border p-3 shadow-lg dark:border-2 dark:border-zinc-600">
                <div className="flex justify-between gap-2 border-b pb-3 dark:border-b-2 dark:border-zinc-600 max-lg:flex-col max-lg:gap-3">
                    <div className="flex gap-2">
                        <Link to="/messenger" className="my-auto">
                            <IoCloseOutline size={25} />
                        </Link>
                        <Link
                            to={`/users/${data.user.id}`}
                            className="flex items-center gap-1 hover:text-accent-orange md:gap-3"
                        >
                            <Avatar avatar={data.user.image} width={30} />
                            <p className="flex items-center font-bold md:text-lg">
                                {!isMinTablet && onlineSymbol} {data.user.name}
                            </p>
                        </Link>
                        {isMinTablet && (
                            <span className="flex items-center">
                                {onlineSymbol}
                                {isMinTablet && online
                                    ? t('online')
                                    : t('offline')}
                            </span>
                        )}
                    </div>
                    <Link
                        to={`/products/${data.item.slug}`}
                        className="flex w-fit items-center gap-3 font-bold hover:text-accent-orange max-md:text-sm"
                    >
                        <img
                            src={data.item.image}
                            className="w-10 rounded-md"
                        />
                        {data.item.name} -{' '}
                        <Price price={data.item.price} text />
                    </Link>
                </div>
                <ul className="mb-3 grid grow gap-2 overflow-y-auto">
                    {Array(40)
                        .fill(0)
                        .map((el, key) => (
                            <Message key={key} />
                        ))}
                </ul>
                <div className="flex gap-3">
                    <Input
                        instance={message}
                        containerClassName="w-full min-w-0"
                    />
                    <Button
                        style="outline"
                        className="dark:hover:border400 aspect-square w-12 !rounded-full !border  border-slate-500 text-slate-500 hover:bg-slate-100 dark:!border-2 dark:border-zinc-500 dark:bg-zinc-700 dark:hover:border-zinc-400 dark:hover:text-zinc-400"
                        onClick={handleSend}
                    >
                        <MdImage size={20} />
                    </Button>
                    <Button
                        style="fill"
                        color="accent-orange"
                        className="aspect-square w-12 hover:drop-shadow-md"
                        onClick={handleSend}
                        // disabled={!message.value}
                    >
                        <IoSend />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Chat
