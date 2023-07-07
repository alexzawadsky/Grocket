import { NavLink, useParams } from 'react-router-dom'
import cn from 'classnames'
import { Avatar } from '../../components/ui'

const ChatLink = ({ chat }) => {
    const unread = Math.random() < 0.5
    const { chatId } = useParams()

    return (
        <NavLink
            to={chat.id}
            className={({ isActive, isPending }) =>
                isActive
                    ? 'rounded-lg bg-slate-100 p-3 dark:bg-zinc-600'
                    : 'rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-zinc-700'
            }
        >
            <div className="flex w-full items-center gap-2">
                <div className="relative w-16">
                    <img src={chat.item.image} className="rounded-md" />
                    <Avatar
                        avatar={chat.user.image}
                        className="absolute left-0 top-0 z-40 -translate-x-1/2 -translate-y-1/2 border-2 border-white"
                        width={25}
                    />
                </div>
                <div className="grid w-full">
                    <p className="line-clamp-1">{chat.user.name}</p>
                    <div className="flex items-baseline gap-2">
                        <p
                            className={cn(
                                'line-clamp-1 text-sm',
                                unread ? 'font-bold text-accent-orange' : null
                            )}
                        >
                            {unread && '• '}
                            {chat.last_message.text}
                        </p>
                        <span className="place-self-end text-[10px] text-slate-500 dark:text-zinc-400">
                            {chat.last_message.time}
                        </span>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export default ChatLink
