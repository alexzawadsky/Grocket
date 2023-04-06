import cn from 'classnames'

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
    border = true
}) => {

    let buttonStyle

    switch (style) {
        case 'outline':
            buttonStyle = cn(
                `bg-white`,
                `text-${color}`,
                `border-${color}`,
                `hover:bg-${color}/[0.2]`
            )
            break;
        case 'fill':
            buttonStyle = cn(
                `bg-${color}`,
                `text-white`,
                `border-${color}`,
                `hover:bg-${color}/[0.8]`
            )
        default:
            break;
    }

    return (
        <button
            onClick={() => onClick && onClick()}
            className={cn(
                className,
                buttonStyle,
                textColor && `text-${textColor}`,
                `bg-${color}`,
                `w-${width}`,
                `h-${height}`,
                `px-${px}`,
                borderColor && `border-${borderColor}`,
                `hover:bg-${onHoverColor}`,
                border && 'border-2',
                'transition-all duration-100  font-bold flex items-center justify-center gap-2 rounded-xl',
                'disabled:!text-slate-600 disabled:!border-2 disabled:!border-slate-600 disabled:!cursor-not-allowed disabled:!bg-transparent'
            )}
            disabled={disabled}
            type={type}
        >
            {children}
        </button>
    )
}

export default Button