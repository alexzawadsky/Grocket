import { Link } from 'react-router-dom'

const FooterCol = ({ col }) => {
    return (
        <li>
            <h3 className="mb-1 text-lg font-bold">{col?.title}</h3>
            <ul>
                {col?.links.map((link, key) => (
                    <li key={key}>
                        <Link
                            to={link?.url}
                            target={link?.blank && '_blank'}
                            className="md:text-md flex w-fit items-center gap-2 text-sm hover:text-white/[.8]"
                        >
                            {link?.icon}
                            {link?.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </li>
    )
}

export default FooterCol
