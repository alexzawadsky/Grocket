import React from 'react'
import cn from 'classnames'
import { PiArrowBendUpLeftBold, PiArrowBendUpRightBold } from 'react-icons/pi'
import { replaceLinksInText } from '../../../utils'

const MessageReply = ({ message, userIsAuthor }) => {
    if (!message?.answer_to) return
    return (
        <div
            className={cn(
                'mb-1.5 mt-2 flex w-fit max-w-[70%] items-center gap-3 text-accent-orange md:max-w-[50%]',
                userIsAuthor ? 'ml-auto flex-row-reverse' : 'mr-auto'
            )}
        >
            <span className="min-w-[20px]">
                {userIsAuthor ? (
                    <PiArrowBendUpLeftBold />
                ) : (
                    <PiArrowBendUpRightBold />
                )}
            </span>

            <p className="line-clamp-1 rounded-full bg-zinc-100 p-1 px-2 text-sm text-black dark:bg-zinc-600 dark:text-white">
                {replaceLinksInText(message?.answer_to?.text)}
            </p>
        </div>
    )
}

export default MessageReply
