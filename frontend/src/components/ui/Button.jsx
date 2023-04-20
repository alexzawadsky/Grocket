import cn from 'classnames'
import { NavLink } from 'react-router-dom';

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
    bold = true
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
            break;
        case 'fill':
            buttonStyle = cn(
                `bg-${color} dark:bg-${darkColor}`,
                `text-white`,
                `border-${color} dark:border-${darkColor}`,
                `hover:bg-${color}/[0.8]`
            )
        default:
            break;
    }

    if (to) return (
        <NavLink
            onClick={() => onClick && onClick()}
            to={to}
            aria-label={ariaLabel}
            className={cn(
                className,
                buttonStyle,
                bold && 'font-bold',
                `w-${width}`,
                `h-${height}`,
                `px-${px}`,
                border && 'border-2',
                'transition-all duration-100 flex items-center justify-center gap-2 rounded-xl'
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
                !style && `bg-${color} dark:bg-${darkColor}`,
                bold && 'font-bold',
                `w-${width}`,
                `h-${height}`,
                `px-${px}`,
                borderColor && `border-${borderColor}`,
                onHoverColor && `hover:bg-${onHoverColor}`,
                onHoverDarkColor && `dark:hover:bg-${onHoverDarkColor}`,
                border && 'border-2',
                'transition-all duration-100 flex items-center justify-center gap-2 rounded-xl',
                'disabled:text-slate-600 disabled:border-2 disabled:border-slate-600 disabled:cursor-not-allowed disabled:bg-transparent'
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