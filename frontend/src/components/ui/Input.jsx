import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BsFillTrashFill } from 'react-icons/bs'
import cn from 'classnames'

const Errors = ({ instance }) => {

    const { t } = useTranslation()

    return (
        <>
            {(instance.isDirty && instance.emailError) && <p className="text-accent-red font-bold">{t('not_email_err')}</p>}
            {(instance.isDirty && instance.pwdError) && <p className="text-accent-red font-bold">{t('pass_err')}</p>}
            {(instance.isDirty && instance.isEmpty) && <p className="text-accent-red font-bold">{t('empty_field_err')}</p>}
            {(instance.isDirty && instance.matchError) && <p className="text-accent-red font-bold">{t('pass_miss_error')}</p>}
            {(instance.isDirty && instance.minLengthError) && <p className="text-accent-red font-bold">Value is too short</p>}
            {(instance.isDirty && instance.intError) && <p className="text-accent-red font-bold">{t('not_int_err')}</p>}
            {(instance.isDirty && instance.floatError) && <p className="text-accent-red font-bold">{t('not_float_err')}</p>}
        </>
    )
}

const Input = ({
    className,
    placeholder,
    id,
    type,
    instance,
    deleteBtn,
    title,
    autoRef,
    disabled,
    split,
    large,
    must,
    containerClassName
}) => {

    const inputRef = useRef()

    useEffect(() => {
        if (autoRef) {
            inputRef.current.focus()
        }
    }, [])

    const inputInner = <>
        {title ? <label className={must ? 'after:content-["*"] after:text-accent-red after:pl-1' : ''} htmlFor={id}>{title}</label> : null}
        <div>
            {large ? <textarea
                id={id}
                ref={inputRef}
                value={instance.value}
                onChange={instance.checkValue}
                onBlur={instance.checkValue}
                disabled={disabled}
                className='grocket-input min-h-[100px] py-2'
            /> : <input
                id={id}
                type={type}
                ref={inputRef}
                value={instance.value}
                onChange={instance.checkValue}
                onBlur={instance.checkValue}
                disabled={disabled}
                className={cn(
                    'grocket-input',
                    className
                )}
                placeholder={placeholder}
            />}
            <Errors instance={instance} />
        </div>
        {deleteBtn && <span></span>}
    </>

    return split ? inputInner : <div className={cn('flex flex-col gap-0.5', containerClassName)}>{inputInner}</div>
}

export default Input