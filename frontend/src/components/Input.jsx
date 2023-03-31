import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BsFillTrashFill } from 'react-icons/bs'

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

const Input = ({ id, type, instance, deleteBtn = true, title, autoRef, disabled, split, large, must }) => {

    const inputRef = useRef()

    useEffect(() => {
        if (autoRef) {
            inputRef.current.focus()
        }
    }, [])

    if (split) {
        return (
            <>
                {title ? <label className={`h-10 flex items-center ${must ? 'after:content-["*"] after:text-accent-red after:pl-1' : ''}`} htmlFor={id}>{title}</label> : null}
                <div className="grid gap-0.5">
                    {large ? <textarea
                        id={id}
                        type={type}
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
                        className='grocket-input'
                    />}
                    <Errors instance={instance} />
                </div>
                {deleteBtn && <div
                    role='button'
                    type="button"
                    className="h-10 w-fit text-accent-red px-2 flex items-center"
                    onClick={() => instance.clear()}
                >
                    <BsFillTrashFill />
                </div>}
            </>
        )
    }

    return (
        <div className='flex flex-col gap-0.5'>
            {title ? <label className={must ? 'after:content-["*"] after:text-accent-red after:pl-1' : ''} htmlFor={id}>{title}</label> : null}
            {large ? <textarea
                id={id}
                type={type}
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
                className='grocket-input'
            />}
            <Errors instance={instance} />
        </div>
    )
}

export default Input