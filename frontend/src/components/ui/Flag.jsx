import countryCodeEmoji from 'country-code-emoji';
import { parse } from 'twemoji-parser';
import cn from 'classnames'

const Flag = ({ country, size, className }) => {

    if (country === null || country === undefined) return
    const emoji = countryCodeEmoji(country)
    const iconLink = parse(emoji)[0]?.url

    return <img
        className={cn(
            `w-${size}`,
            className
        )}
        src={iconLink}
        alt={`${country} flag icon`}
    />
};

export default Flag;