import LanguageDropdown from './LanguageDropdown'
import CurrencyDropdown from './CurrencyDropdown'
import ThemeToggle from './ThemeToggle'

const NavbarDropdowns = () => {
    return (
        <>
            <li>
                <LanguageDropdown />
            </li>
            <li>
                <CurrencyDropdown />
            </li>
            <li className="mr-auto">
                <ThemeToggle />
            </li>
        </>
    )
}

export default NavbarDropdowns
