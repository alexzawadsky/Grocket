import cn from 'classnames'
import { NavLink } from 'react-router-dom'

const Button = ({
    type,
    children,
    onClick,
    disabled,
    className,
    width,
    color,
    textColor,
    height,
    px,
    borderColor,
    onHoverColor,
    style,
    border = true,
    darkColor,
    onHoverDarkColor,
    ariaLabel,
    tabIndex = 1,
    to,
    bold = true,
}) => {
    let buttonStyle

    switch (style) {
        case 'outline':
            buttonStyle = cn(
                `bg-none`,
                `text-${color} dark:text-${darkColor}`,
                `border-${color} dark:border-${darkColor}`,
                `hover:bg-${color}/[0.2]`
            )
            break
        case 'fill':
            buttonStyle = cn(
                `bg-${color} dark:bg-${darkColor}`,
                `text-white`,
                `border-${color} dark:border-${darkColor}`,
                `hover:bg-${color}/[0.8]`
            )
        default:
            break
    }

    if (to)
        return (
            <NavLink
                onClick={() => onClick && onClick()}
                to={to}
                aria-label={ariaLabel}
                className={cn(
                    className,
                    buttonStyle,
                    bold && 'font-bold',
                    width && `w-${width}`,
                    height && `h-${height}`,
                    px && `px-${px}`,
                    border && 'border-2',
                    'flex items-center justify-center gap-2 rounded-xl transition-all duration-100'
                )}
            >
                {children}
            </NavLink>
        )

    return (
        <button
            aria-label={ariaLabel}
            onClick={() => onClick && onClick()}
            className={cn(
                className,
                buttonStyle,
                textColor && `text-${textColor}`,
                !style &&
                    color &&
                    darkColor &&
                    `bg-${color} dark:bg-${darkColor}`,
                bold && 'font-bold',
                width && `w-${width}`,
                height && `h-${height}`,
                px && `px-${px}`,
                borderColor && `border-${borderColor}`,
                onHoverColor && `hover:bg-${onHoverColor}`,
                onHoverDarkColor && `dark:hover:bg-${onHoverDarkColor}`,
                border && 'border-2',
                'flex items-center justify-center gap-2 rounded-xl transition-all duration-100',
                'disabled:cursor-not-allowed disabled:border-2 disabled:border-slate-600 disabled:bg-transparent disabled:text-slate-600'
            )}
            disabled={disabled}
            type={type}
            tabIndex={tabIndex}
        >
            {children}
        </button>
    )
}

export default Button
