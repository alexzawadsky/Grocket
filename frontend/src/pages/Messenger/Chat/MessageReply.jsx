import React from 'react'
import cn from 'classnames'
import { PiArrowBendUpLeftBold, PiArrowBendUpRightBold } from 'react-icons/pi'

const MessageReply = ({ message, userIsAuthor }) => {
    if (!message?.answer_to) return
    return (
        <div
            className={cn(
                'mb-1.5 flex w-fit max-w-[70%] items-center gap-3 text-accent-orange md:max-w-[50%]',
                userIsAuthor ? 'ml-auto mr-7 flex-row-reverse' : 'mr-auto'
            )}
        >
            {userIsAuthor ? (
                <PiArrowBendUpLeftBold />
            ) : (
                <PiArrowBendUpRightBold />
            )}
            <p className="line-clamp-1 rounded-full bg-zinc-100 p-1 px-2 text-sm text-black dark:text-white">
                {message?.answer_to?.text}
            </p>
        </div>
    )
}

export default MessageReply
