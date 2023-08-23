import React, { useContext } from 'react'
import cn from 'classnames'
import AuthContext from '../../../contexts/AuthProvider'
import { BsCheck, BsCheckAll } from 'react-icons/bs'
import MessageReply from './MessageReply'

const Message = ({ message, setReply }) => {
    const { user } = useContext(AuthContext)
    const userIsAuthor = message?.author == user?.user_id

    return (
        <div>
            <MessageReply message={message} userIsAuthor={userIsAuthor} />
            <div
                className={cn(
                    'flex h-fit items-center gap-3',
                    userIsAuthor ? 'flex-row-reverse' : ''
                )}
            >
                {userIsAuthor && (
                    <p className="w-4 text-accent-orange">
                        {message.is_seen ? <BsCheckAll /> : <BsCheck />}
                    </p>
                )}
                <div
                    className={cn(
                        userIsAuthor
                            ? 'items-end bg-accent-orange-dimmed dark:bg-accent-orange-dimmed-dark'
                            : 'items-start bg-slate-100 dark:bg-zinc-700',
                        'w-fit max-w-[80%] rounded-lg px-2 py-1 md:max-w-[60%]'
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
        </div>
    )
}

export default Message
