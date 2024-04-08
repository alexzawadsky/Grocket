import countryCodeEmoji from 'country-code-emoji'
import { parse } from 'twemoji-parser'
import cn from 'classnames'

const Flag = ({ country, size, className, width }) => {
    if (country === null || country === undefined) return
    const emoji = countryCodeEmoji(country)
    const iconId = parse(emoji)[0]?.url.split('/').at(-1)

    return (
        <img
            className={cn(`w-${size} h-${size}`, className)}
            src={'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/' + iconId}
            aria-label={`${country} flag icon`}
            width={width}
        />
    )
}

export default Flag
