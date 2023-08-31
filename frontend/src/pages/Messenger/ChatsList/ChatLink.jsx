import { Link, NavLink } from 'react-router-dom'
import cn from 'classnames'
import { Avatar, PublishTime } from '../../../components/ui'
import { Button } from '../../../components/ui'
import { useContext, useState } from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { useDeleteChatMutation } from '../../../api/api'
import AuthContext from '../../../contexts/AuthProvider'
import LastMessage from './LastMessage'

const ChatLink = ({ chat }) => {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()
    const deleteChatMutation = useDeleteChatMutation()
    const { user } = useContext(AuthContext)

    return (
        <NavLink
            to={`${chat?.id}`}
            className={({ isActive, isPending }) =>
                isActive
                    ? 'h-fit rounded-lg bg-slate-100 p-3 dark:bg-zinc-600'
                    : 'h-fit rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-zinc-700'
            }
        >
            <div className="grid grid-cols-[auto_1fr_auto] gap-2">
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
                <div className="flex grow flex-col items-start justify-between">
                    <p className="line-clamp-1">
                        {chat?.user?.first_name} {chat.user?.last_name}
                    </p>
                    <LastMessage lastMessage={chat?.last_message} />
                </div>
                <div className="grid w-full">
                    <div className="flex flex-col items-baseline justify-between gap-2">
                        {!open ? (
                            <Link
                                border={false}
                                className="rounded-full"
                                onClick={() => setOpen(true)}
                                to=""
                            >
                                <BiDotsHorizontalRounded />
                            </Link>
                        ) : (
                            <div>
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
                                <Link
                                    border={false}
                                    className="rounded-full px-2 font-primary text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    onClick={() => setOpen(false)}
                                    px={2}
                                    to=""
                                >
                                    {t('cancel')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export default ChatLink
