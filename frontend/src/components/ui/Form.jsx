import React, { useEffect, useRef } from 'react'

const Form = ({ onSubmit, className, children, ariaLabel, errors }) => {
    const formRef = useRef()

    useEffect(() => {
        if (!errors) return
        let errorFields = []
        Object.keys(errors).map((key) => {
            const errorField = formRef.current.querySelector(`#${key}-error`)
            if (errorField) {
                errorField.innerText = errors[key].join('\n')
                errorFields.push(errorField)
            }
        })

        errorFields.sort((el) => -el.getBoundingClientRect().top)
        const yOffset = -115
        const y =
            errorFields[0].getBoundingClientRect().top +
            window.pageYOffset +
            yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
    }, [errors])

    return (
        <form
            ref={formRef}
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
