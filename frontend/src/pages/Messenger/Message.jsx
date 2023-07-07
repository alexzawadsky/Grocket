import React from 'react'
import cn from 'classnames'

const Message = () => {
    const message = {
        text: 'message tex oiu oiu o oiuouoiuoi  oiuoiuoiu oiu lorem laj;lkjpoiu  po iupoiu',
        my: Math.random() < 0.5,
        time: '13:53',
    }
    return (
        <div
            className={cn(
                'flex items-center gap-3',
                !message.my ? '' : 'flex-row-reverse'
            )}
        >
            <div
                className={cn(
                    message.my
                        ? 'bg-accent-orange-dimmed dark:bg-accent-orange-dimmed-dark items-end'
                        : 'items-start bg-slate-100 dark:bg-zinc-700',
                    'w-fit max-w-[60%] rounded-lg p-1 px-2'
                )}
            >
                {message.text}
            </div>
            <p className="text-[10px] text-slate-400">{message.time}</p>
        </div>
    )
}

export default Message
