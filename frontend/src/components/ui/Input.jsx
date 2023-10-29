import { useEffect, useRef } from 'react'
import { BsTrashFill } from 'react-icons/bs'
import cn from 'classnames'
import Button from './Button'
import { BiError } from 'react-icons/bi'

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
    containerClassName,
    ariaLabel,
    boldTitle,
    titleSize,
    name,
    hasError,
    autocomplete,
    onfocus,
    onblur,
    ref,
}) => {
    const inputRef = useRef()

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const inputStyle =
        'rounded-lg transition-colors duration-[25] border-slate-500 dark:border-zinc-500 dark:bg-zinc-700 focus:border-slate-800 focus:dark:border-zinc-400 focus:shadow-md focus:outline-none border dark:border-2 px-3 w-full h-10 disabled:text-zinc-600 disabled:bg-zinc-100 disabled:dark:bg-zinc-800 disabled:dark:border-zinc-600'
    const errorStyle =
        (hasError || (instance.isDirty && !instance.allValid)) &&
        '!outline-2 !text-accent-red !bg-accent-red/[0.05] !border-accent-red !outline-offset-1'
    const inputInner = (
        <>
            {title && (
                <label
                    className={cn(
                        must &&
                            'after:pl-1 after:text-accent-red after:content-["*"]',
                        boldTitle && 'font-bold',
                        titleSize && `text-${titleSize}`
                    )}
                    htmlFor={id}
                >
                    {title}
                </label>
            )}
            <div className="relative">
                {large ? (
                    <textarea
                        aria-label={ariaLabel}
                        id={id}
                        ref={inputRef}
                        value={instance.value}
                        onChange={instance.checkValue}
                        onBlur={() => {
                            instance.checkValue
                            onblur && onblur()
                        }}
                        onFocus={onfocus && onfocus()}
                        disabled={disabled}
                        className={cn(
                            inputStyle,
                            errorStyle,
                            'min-h-[100px] py-2',
                            className
                        )}
                        autoComplete={autocomplete}
                    />
                ) : (
                    <input
                        aria-label={ariaLabel}
                        id={id}
                        type={type}
                        ref={ref ? ref : inputRef}
                        value={instance.value}
                        onChange={instance.checkValue}
                        onBlur={() => {
                            instance.checkValue
                            setTimeout(() => onblur && onblur(), 100)
                        }}
                        onFocus={() => onfocus && onfocus()}
                        disabled={disabled}
                        className={cn(inputStyle, errorStyle, className)}
                        placeholder={placeholder}
                        autoComplete={autocomplete}
                    />
                )}
                {(hasError || (instance.isDirty && !instance.allValid)) && (
                    <BiError className="absolute right-3 top-3 text-accent-red" />
                )}
                {hasError && (
                    <p
                        aria-live="assertive"
                        className="font-bolditalic text-sm text-accent-red"
                        id={`${name}-error`}
                    ></p>
                )}
            </div>
            {deleteBtn && (
                <Button
                    type="button"
                    onClick={() => instance.setValue('')}
                    textColor="accent-red"
                    border={false}
                    px={2}
                    width="fit"
                    tabindex={-1}
                    className="mb-auto mt-3"
                >
                    <BsTrashFill />
                </Button>
            )}
        </>
    )

    return split ? (
        inputInner
    ) : (
        <div className={cn('flex flex-col gap-0.5', containerClassName)}>
            {inputInner}
        </div>
    )
}

export default Input
