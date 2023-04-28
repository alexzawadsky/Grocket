import React from 'react'

const Form = ({ onSubmit, className, children, ariaLabel }) => {
    return (
        <form
            aria-label={ariaLabel}
            onSubmit={(e) => {
                e.preventDefault()
                onSubmit && onSubmit()
            }}
            className={className}
        >
            {children}
        </form>
    )
}

export default Form
