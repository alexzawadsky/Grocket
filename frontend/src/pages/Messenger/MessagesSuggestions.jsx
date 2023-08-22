import React, { useContext } from 'react'
import { Button } from '../../components/ui'
import MessengerContext from '../../contexts/MessengerContext'

const suggestions = [
    'Hello, is it still available?',
    'Can you make a discount?',
    'How old is it?',
]

const MessagesSuggestions = ({ chatId }) => {
    const { sendMessage } = useContext(MessengerContext)
    return (
        <div className="mb-3 flex flex-wrap gap-3">
            {suggestions.map((s, key) => (
                <Button
                    px={3}
                    key={key}
                    border={false}
                    className="bg-zinc-200  text-left !font-primary hover:bg-zinc-300 dark:bg-zinc-600 dark:text-white hover:dark:bg-zinc-500"
                    onClick={() => sendMessage(chatId, { message: s })}
                >
                    {s}
                </Button>
            ))}
        </div>
    )
}

export default MessagesSuggestions
