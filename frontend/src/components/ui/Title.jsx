import cn from 'classnames'

const Title = ({ text, className, color, size, italic, children }) => {
    return (
        <h1
            className={cn(
                'text-3xl font-bold',
                className,
                color && `text-${color}`,
                size && `text-${size}`,
                italic && 'font-bolditalic'
            )}
        >
            {text ? text : null}
            {children ? children : null}
        </h1>
    )
}

export default Title
