import { sendPushNotification } from "../utils"

export const addNewMessage = (message, queryClient) => {
    sendPushNotification('New message!', message?.text, `${import.meta.env.VITE_API_URL}/messenger/${message?.chat}`)

    const currentData = queryClient.getQueryData([
        'messenger',
        'chats',
        message?.chat
    ])

    if (!currentData) return

    const updatedFirstPage = {
        ...currentData.pages[0],
        data: {
            ...currentData.pages[0].data,
            results: [
                message,
                ...currentData.pages[0].data?.results,
            ],
        },
    }

    queryClient.setQueryData(
        ['messenger', 'chats', message?.chat],
        {
            pages: [updatedFirstPage, ...currentData.pages.slice(1)],
            pageParams: currentData.pageParams,
        }
    )
}

export const updateLastMessageInChatList = (message, queryClient) => {
    const chatsListData = queryClient.getQueryData(['messenger', 'chats'])
    const newList = chatsListData.map(chat => chat?.id === message?.chat ? {
        ...chat,
        last_message: message
    } : chat)

    queryClient.setQueryData(['messenger', 'chats'], newList)
}

export const addNewChat = (chat, queryClient) => {
    const chatsList = queryClient.getQueryData(['messenger', 'chats'])
    queryClient.setQueryData(['messenger', 'chats'], [...chatsList, chat])
}