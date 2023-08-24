import { useContext, useState } from 'react'
import { Form, Input, Button } from '../components/ui'
import { IoSend } from 'react-icons/io5'
import { IoIosArrowDown } from 'react-icons/io'
import { MdImage } from 'react-icons/md'
import useInput from '../hooks/useInput'
import MessengerContext from '../contexts/MessengerContext'
import { PiArrowBendUpRightBold } from 'react-icons/pi'
import { GrFormClose } from 'react-icons/gr'

const ChatMessageForm = ({
    chat,
    onBottom,
    replyTo,
    scrollToBottom,
    setReplyTo,
}) => {
    const message = useInput('', { maxLength: 1000 })
    const [image, setImage] = useState(null)
    const { sendMessage } = useContext(MessengerContext)

    const handleSend = () => {
        if (message.value.trim() === '') return
        const messageObj = {
            text: message.value,
            image: image,
            answer_to: replyTo?.id,
        }
        sendMessage(chat?.id, messageObj)
        message.setValue('')
    }

    return (
        <Form className="relative flex gap-3" onSubmit={handleSend}>
            {replyTo && (
                <div className="absolute -top-11 left-0 z-10 mb-1.5 mt-2 flex h-7 w-fit max-w-[70%] items-center text-accent-orange md:max-w-[50%]">
                    <span className="mr-3 min-w-[20px]">
                        {<PiArrowBendUpRightBold />}
                    </span>
                    <p className="line-clamp-1 rounded-l-full bg-zinc-100 p-1 px-2 text-sm text-black dark:bg-zinc-600 dark:text-white">
                        {replyTo?.text}
                    </p>
                    <Button
                        border={false}
                        className="h-full rounded-r-full bg-zinc-100 pl-1.5 pr-2 text-xl text-black hover:bg-zinc-200 dark:bg-zinc-600 dark:text-white dark:hover:bg-zinc-500"
                        onClick={() => setReplyTo(null)}
                    >
                        <GrFormClose />
                    </Button>
                </div>
            )}
            <Input
                instance={message}
                containerClassName="w-full min-w-0"
                autoRef
                disabled={!chat}
            />
            <Button
                style="outline"
                type="button"
                className="dark:hover:border-400 aspect-square h-10 w-10 !rounded-full  border-slate-500 text-slate-500 hover:bg-slate-100 dark:!border-2 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:text-zinc-400"
                onClick={handleSend}
                disabled={!chat || !message.allValid}
            >
                <MdImage size={20} />
            </Button>
            <Button
                style="fill"
                type="button"
                color="accent-orange"
                className="aspect-square h-10 w-10 hover:drop-shadow-md"
                onClick={handleSend}
                disabled={!chat || !message.allValid}
            >
                <IoSend />
            </Button>
            {!onBottom && chat && (
                <Button
                    className="dark:hover:border-400 absolute -top-[3.25rem] right-0 aspect-square h-10 w-10 !rounded-full !border border-slate-500  bg-white text-slate-500 hover:bg-slate-100 dark:!border-2 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-400 dark:hover:text-zinc-400"
                    onClick={scrollToBottom}
                    type="button"
                >
                    <IoIosArrowDown />
                </Button>
            )}
        </Form>
    )
}

export default ChatMessageForm
