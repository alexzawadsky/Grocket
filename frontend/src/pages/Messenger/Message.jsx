import React from 'react'
import cn from 'classnames'

const Message = ({ message }) => {
    return (
        <div
            className={cn(
                'flex h-fit items-center gap-3',
                message?.my ? 'flex-row-reverse' : ''
            )}
        >
            <div
                className={cn(
                    message?.my
                        ? 'items-end bg-accent-orange-dimmed dark:bg-accent-orange-dimmed-dark'
                        : 'items-start bg-slate-100 dark:bg-zinc-700',
                    'w-fit max-w-[60%] rounded-lg p-1 px-2'
                )}
            >
                {message?.text}
            </div>
            <p className="text-[10px] text-slate-400">
                {new Date(message?.pub_date).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                })}
            </p>
        </div>
    )
}

export default Message
