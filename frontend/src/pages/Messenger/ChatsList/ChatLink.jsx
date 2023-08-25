import { Link, NavLink } from 'react-router-dom'
import cn from 'classnames'
import { Avatar, PublishTime } from '../../../components/ui'
import { Button } from '../../../components/ui'
import { useState } from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { useDeleteChatMutation } from '../../../api/api'

const ChatLink = ({ chat }) => {
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
                        className="absolute left-0 top-0 z-40 -translate-x-1/2 -translate-y-1/2 border border-white dark:border-zinc-600"
                        width={25}
                    />
                </div>
                <div className="grid w-full">
                    <div className="flex items-center justify-between">
                        <p className="line-clamp-1">
                            {chat?.user?.first_name} {chat.user?.last_name}
                        </p>
                        {!open && (
                            <Link
                                border={false}
                                className="rounded-full"
                                onClick={() => setOpen(true)}
                                to=""
                            >
                                <BiDotsHorizontalRounded />
                            </Link>
                        )}
                        {open && (
                            <Link
                                border={false}
                                className=" h-5 rounded-full px-2 !font-primary text-sm text-accent-red transition-colors hover:bg-accent-red/[.1] dark:hover:bg-zinc-700"
                                px={2}
                                onClick={() =>
                                    deleteChatMutation.mutate(chat?.id)
                                }
                                to=""
                            >
                                {t('delete')}
                            </Link>
                        )}
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                        <p
                            className={cn(
                                'line-clamp-1 text-sm',
                                !chat?.last_message?.is_seen
                                    ? 'text-accent-orange'
                                    : null
                            )}
                        >
                            {!chat?.last_message?.is_seen && '• '}
                            {chat?.last_message?.text}
                        </p>
                        {!open && (
                            <p className="whitespace-nowrap text-[10px] text-slate-500 dark:text-zinc-400">
                                <PublishTime
                                    style="twitter"
                                    pubDate={chat?.last_message?.pub_date}
                                />
                            </p>
                        )}
                        {open && (
                            <Link
                                border={false}
                                className="rounded-full px-2 font-primary text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                onClick={() => setOpen(false)}
                                px={2}
                                to=""
                            >
                                {t('cancel')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export default ChatLink
