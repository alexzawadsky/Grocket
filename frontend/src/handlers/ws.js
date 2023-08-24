const blinkTabWhenInBackground = () => {
    const originalTitle = document.title
    let isTabBlinking = false;

    const blinkInterval = setInterval(() => {
        if (!document.hidden) {
            clearInterval(blinkInterval)
            document.title = originalTitle
        } else {
            if (!isTabBlinking) {
                document.title = "New Message!"
            } else {
                document.title = originalTitle
            }
            isTabBlinking = !isTabBlinking
        }
    }, 1000)
}

const openPage = (url) => {
    const existingTab = Array.from(window.frames).find(frame => frame.location.href === url)
    if (existingTab) {
        existingTab.focus()
    } else {
        window.open(url, "_blank")
    }
}

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
    Notification.requestPermission().then(perm => {
        if (perm === 'granted' && document.hidden) {
            const notification = new Notification("New Message", {
                body: message?.text,
                icon: "logo.png"
            })
            notification.onclick = () => {
                openPage(`${import.meta.env.VITE_API_URL}/messenger/${message?.chat}`)
            }
            blinkTabWhenInBackground()
        }
    })

}