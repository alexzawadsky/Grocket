export const addNewMessage = (message, queryClient) => {
    const currentData = queryClient.getQueryData([
        'messenger',
        'chats',
        message?.chat
    ])
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