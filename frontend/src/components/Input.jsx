import React from "react";
import { useEffect, useRef } from "react";
import { BsFillTrashFill } from 'react-icons/bs'

const Input = ({ id, type, instance, className, title, autoRef, disabled, split, large, must }) => {

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
                        className='grocket-input min-h-[100px]'
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
                    {(instance.isDirty && instance.emailError) && <p className="text-accent-red font-bold">Not valid email</p>}
                    {(instance.isDirty && instance.pwdError) && <p className="text-accent-red font-bold">Pass err</p>}
                    {(instance.isDirty && instance.isEmpty) && <p className="text-accent-red font-bold">Field can't be empty</p>}
                    {(instance.isDirty && instance.matchError) && <p className="text-accent-red font-bold">Pass mismatch</p>}
                    {(instance.isDirty && instance.minLengthError) && <p className="text-accent-red font-bold">Value is too short</p>}
                    {(instance.isDirty && instance.intError) && <p className="text-accent-red font-bold">Not integer</p>}
                    {(instance.isDirty && instance.floatError) && <p className="text-accent-red font-bold">Not float</p>}
                </div>
                <button type="button" className="h-10 w-fit text-accent-red px-5" onClick={() => instance.clear()}><BsFillTrashFill /></button>
            </>
        )
    } else {
        return (
            <div className='flex flex-col gap-0.5'>
                {title ? <label className={must ? 'after:content-["*"] after:text-accent-red after:pl-1' : ''} htmlFor={id}>{title}</label> : null}
                <input
                    id={id}
                    type={type}
                    ref={inputRef}
                    value={instance.value}
                    onChange={instance.checkValue}
                    onBlur={instance.checkValue}
                    disabled={disabled}
                    className='grocket-input w-1/2'
                />
                {(instance.isDirty && instance.emailError) && <p className="text-accent-red font-bold">Not valid email</p>}
                {(instance.isDirty && instance.pwdError) && <p className="text-accent-red font-bold">Pass err</p>}
                {(instance.isDirty && instance.isEmpty) && <p className="text-accent-red font-bold">Field can't be empty</p>}
                {(instance.isDirty && instance.matchError) && <p className="text-accent-red font-bold">Pass mismatch</p>}
                {(instance.isDirty && instance.minLengthError) && <p className="text-accent-red font-bold">Value is too short</p>}
                {(instance.isDirty && instance.intError) && <p className="text-accent-red font-bold">Not integer</p>}
                {(instance.isDirty && instance.floatError) && <p className="text-accent-red font-bold">Not float</p>}
            </div>
        )
    }
}
export default Input