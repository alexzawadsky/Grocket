import React from 'react'

const Form = ({ onSubmit, className, children }) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                onSubmit && onSubmit()
            }
            }
            className={className}
        >
            {children}
        </form>
    )
}

export default Form