import React from 'react'

const Title = ({ text, className }) => {
    return (
        <h1 className={`text-3xl font-bold ${className}`}>{text}</h1>
    )
}

export default Title