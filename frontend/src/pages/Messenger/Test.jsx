import React, { useState, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { Button } from '../../components/ui'
import { useParams } from 'react-router-dom'
import Message from './Message'

const Test = () => {
    const [message, setMessage] = useState('')
    const { chatId } = useParams()
    const [chatHistory, setChatHistory] = useState([])
    const { readyState, sendJsonMessage, getWebSocket } = useWebSocket(
        'ws://127.0.0.1:8000/',
        {
            onOpen: () => {
                sendJsonMessage({
                    roomId: chatId,
                    text: 'new client connected',
                })
            },
            onMessage: (e) => {
                const message = e.data
                setChatHistory((s) => [...s, message])
            },
        }
    )

    const handleSend = () => {
        if (message.trim() !== '') {
            const messageObj = {
                roomId: chatId,
                text: message,
            }
            sendJsonMessage(messageObj)
            setMessage('')
        }
    }

    const handleDisconnect = () => {
        console.log('disconnect')
        sendJsonMessage({ roomId: chatId, text: 'client disconnected' })
        const ws = getWebSocket()
        ws.close()
    }

    useEffect(() => {
        return handleDisconnect
    }, [])

    return (
        <div>
            <div className="grid gap-3">
                {chatHistory.map((msg, index) => (
                    <div key={index} className="message">
                        <Message>{JSON.stringify(msg)}</Message>
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    className="text-black"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="message"
                />
                <Button onClick={handleSend}>send</Button>
            </div>
        </div>
    )
}

export default Test
