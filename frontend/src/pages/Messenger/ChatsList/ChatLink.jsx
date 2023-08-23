import { NavLink, useParams } from 'react-router-dom'
import cn from 'classnames'
import { Avatar, PublishTime } from '../../../components/ui'
import { Button } from '../../../components/ui'
import { useState } from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { useDeleteChatMutation } from '../../../api/api'

const ChatLink = ({ chat }) => {
    const { chatId } = useParams()
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()
    const deleteChatMutation = useDeleteChatMutation()

    return (
        <NavLink
            to={`${chat?.id}`}
            className={({ isActive, isPending }) =>
                isActive
                    ? 'h-fit rounded-lg bg-slate-100 p-3 dark:bg-zinc-600'
                    : 'h-fit rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-zinc-700'
            }
        >
            <div className="flex w-full items-center gap-2">
                <div className="relative w-16">
                    <img
                        src={chat?.product?.image?.image}
                        className="rounded-md"
                    />
                    <Avatar
                        avatar={chat?.user?.avatar}
                        className="absolute left-0 top-0 z-40 -translate-x-1/2 -translate-y-1/2 border-2 border-white dark:border-zinc-600"
                        width={25}
                    />
                </div>
                <div className="grid w-full">
                    <div className="flex items-center justify-between">
                        <p className="line-clamp-1">
                            {chat?.user?.first_name} {chat.user?.last_name}
                        </p>
                        {!open && (
                            <Button
                                border={false}
                                className="text-lg"
                                onClick={() => setOpen(true)}
                            >
                                <BiDotsHorizontalRounded />
                            </Button>
                        )}
                        {open && (
                            <Button
                                border={false}
                                className=" h-5 !font-primary text-sm text-accent-red hover:bg-accent-red/[.1]"
                                px={1}
                                onClick={() =>
                                    deleteChatMutation.mutate(chat?.id)
                                }
                            >
                                {t('delete')}
                            </Button>
                        )}
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                        <p
                            className={cn(
                                'line-clamp-1 text-sm',
                                !chat?.messages?.at(0).is_seen
                                    ? 'text-accent-orange'
                                    : null
                            )}
                        >
                            {!chat?.messages?.at(0).is_seen && '• '}
                            {chat?.messages.at(0)?.text}
                        </p>
                        {!open && (
                            <p className="whitespace-nowrap text-[10px] text-slate-500 dark:text-zinc-400">
                                <PublishTime
                                    style="twitter"
                                    pubDate={chat?.messages.at(-1)?.pub_date}
                                />
                            </p>
                        )}
                        {open && (
                            <Button
                                border={false}
                                className="font-primary text-sm hover:bg-zinc-200"
                                onClick={() => setOpen(false)}
                                px={1}
                            >
                                {t('cancel')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export default ChatLink
