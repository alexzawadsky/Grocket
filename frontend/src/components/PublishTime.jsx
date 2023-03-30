import React from 'react'

const PublishTime = ({ pubDate }) => {
    return new Date(pubDate).toLocaleDateString(
        undefined,
        {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }
    )
}

export default PublishTime