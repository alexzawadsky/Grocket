import { NavLink } from "react-router-dom"

const FooterCol = ({ col }) => {
    return (
        <li>
            <h3 className="font-bold text-lg mb-1">{col?.title}</h3>
            <ul>
                {col?.links.map((link, key) => <li key={key}>
                    <NavLink
                        to={link?.url}
                        target={link?.blank && '_blank'}
                        className='flex items-center gap-2 text-sm md:text-md hover:text-white/[.8] w-fit'
                    >
                        {link?.icon}
                        {link?.name}
                    </NavLink>
                </li>)}
            </ul>
        </li>
    )
}

export default FooterCol