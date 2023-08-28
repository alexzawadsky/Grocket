import React from 'react'
import { useTranslation } from 'react-i18next'

const isFirstDateNewer = (firstPubDate, secondPubDate) => {
    if (!secondPubDate) return true
    const firstDate = new Date(firstPubDate)
    const secondDate = new Date(secondPubDate)
    const firstDateWithoutTime = new Date(firstDate)
    firstDateWithoutTime.setHours(0, 0, 0, 0) // Set time to midnight

    const secondDateWithoutTime = new Date(secondDate)
    secondDateWithoutTime.setHours(0, 0, 0, 0) // Set time to midnight

    return firstDateWithoutTime > secondDateWithoutTime
}

const DateBadge = ({ pubDate, prevPubDate }) => {
    const { i18n } = useTranslation()
    const date = new Date(pubDate)

    if (!isFirstDateNewer(pubDate, prevPubDate)) return

    return (
        <div className="mx-auto rounded-full bg-slate-100 px-5 text-sm text-slate-600 shadow-sm dark:border-zinc-500 dark:bg-zinc-600 dark:text-slate-100">
            {date.toLocaleString(i18n.resolvedLanguage, {
                day: '2-digit',
                month: 'short',
            })}
        </div>
    )
}

export default DateBadge
