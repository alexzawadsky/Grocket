import React, { Suspense, useContext, useState } from 'react'
import cn from 'classnames'
import AuthContext from '../../../contexts/AuthProvider'
import {
    BsCheck,
    BsCheckAll,
    BsTrash,
    BsFillCheckCircleFill,
} from 'react-icons/bs'
import MessageReply from './MessageReply'
import { Button } from '../../../components/ui'
import { PiArrowBendUpLeftBold, PiArrowBendUpRightBold } from 'react-icons/pi'
import { FiCopy } from 'react-icons/fi'
import { useDeleteMessageMutation } from '../../../api/api'

const Message = ({ message, setReplyTo }) => {
    const { user } = useContext(AuthContext)
    const userIsAuthor = message?.author == user?.user_id
    const [isCopied, setIsCopied] = useState(false)
    const deleteMessageMutation = useDeleteMessageMutation()

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(message?.text)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="group/message">
            <MessageReply message={message} userIsAuthor={userIsAuthor} />
            <div
                className={cn(
                    'flex h-fit items-center gap-3',
                    userIsAuthor ? 'flex-row-reverse' : ''
                )}
            >
                {/* {userIsAuthor && (
                    <p className="w-4 text-accent-orange">
                        {message.is_seen ? <BsCheckAll /> : <BsCheck />}
                    </p>
                )} */}
                <div
                    className={cn(
                        userIsAuthor
                            ? 'items-end bg-accent-orange-dimmed dark:bg-accent-orange-dimmed-dark'
                            : 'items-start bg-slate-100 dark:bg-zinc-700',
                        'white w-fit max-w-[80%] break-words rounded-lg px-2 py-1 md:max-w-[60%]'
                    )}
                >
                    {message?.text}
                </div>
                <p className="text-[10px] text-slate-400 group-hover/message:hidden group-focus/message:hidden">
                    {new Date(message?.pub_date).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                    })}
                </p>
                <div
                    className={cn(
                        'hidden gap-3 group-hover/message:flex group-focus/message:flex',
                        !userIsAuthor ? 'flex-row-reverse' : ''
                    )}
                >
                    <Button
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        border={false}
                        onClick={() => setReplyTo(message)}
                    >
                        {userIsAuthor ? (
                            <PiArrowBendUpLeftBold />
                        ) : (
                            <PiArrowBendUpRightBold />
                        )}
                    </Button>
                    <Button
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        border={false}
                        onClick={copyToClipboard}
                    >
                        {isCopied ? (
                            <BsFillCheckCircleFill color="#008000" />
                        ) : (
                            <FiCopy />
                        )}
                    </Button>
                    {/* {userIsAuthor && (
                        <Button
                            className="text-accent-red/[.65] hover:text-accent-red"
                            border={false}
                            onClick={() =>
                                deleteMessageMutation.mutate(message?.id)
                            }
                        >
                            <BsTrash />
                        </Button>
                    )} */}
                </div>
            </div>
        </div>
    )
}

export default Message
