import { Link, useLocation } from 'react-router-dom'
import useScreen from '../../hooks/useScreen'
import logo from '../../assets/images/logo.png'
import heart from '../../assets/icons/ukraine.svg'
import { useTranslation } from 'react-i18next'

const HomeButton = () => {
    const { isMinTablet } = useScreen()
    const location = useLocation()
    const isMessenger = location.pathname.startsWith('/messenger')
    const { t } = useTranslation()

    return (
        <li className="flex items-center gap-1 max-md:mr-auto">
            <Link
                className="hover:text-accent-orange/[0.8] flex items-center gap-2 font-bolditalic text-3xl text-accent-orange"
                to="/"
            >
                {isMinTablet && !isMessenger ? (
                    'Grocket'
                ) : (
                    <img className="h-10" src={logo} alt="grocket logo" />
                )}
            </Link>
            {isMessenger && isMinTablet && (
                <p className="px-1 text-2xl font-bold">{t('messenger')}</p>
            )}
            {/* <Link
                to="https://www.standwithukraine.how"
                target="_blank"
                className="mb-auto"
            >
                <img
                    src={heart}
                    className="mb-auto aspect-square w-4 md:w-5"
                    alt="heart with ukranian flag background"
                />
            </Link> */}
        </li>
    )
}

export default HomeButton
