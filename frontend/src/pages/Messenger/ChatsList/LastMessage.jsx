import React, { useContext } from 'react'
import cn from 'classnames'
import AuthContext from '../../../contexts/AuthProvider'
import { PublishTime } from '../../../components/ui'

const LastMessage = ({ lastMessage }) => {
    const { user } = useContext(AuthContext)

    if (!lastMessage?.text) return

    return (
        <div className="flex w-full items-baseline justify-between">
            <p
                className={cn(
                    'line-clamp-1 text-sm'
                    // (user?.user_id !== lastMessage?.author &&
                    //     lastMessage === null) ||
                    //     lastMessage?.is_seen
                    //     ? null
                    //     : 'text-accent-orange'
                )}
            >
                {/* {(user?.user_id !== lastMessage?.author &&
                    lastMessage === null) ||
                lastMessage?.is_seen
                    ? null
                    : '• '} */}
                {lastMessage?.text}
            </p>
            <p className="whitespace-nowrap text-[10px] text-slate-500 dark:text-zinc-400">
                <PublishTime style="twitter" pubDate={lastMessage?.pub_date} />
            </p>
        </div>
    )
}

export default LastMessage
