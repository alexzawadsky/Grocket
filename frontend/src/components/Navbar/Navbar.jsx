import { Link, NavLink } from 'react-router-dom'
import { MdOutlineSell } from 'react-icons/md'
import AuthContext from '../../contexts/AuthProvider'
import { useContext, useEffect, useState } from 'react'
import { FiLogIn, FiUserPlus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import useScreen from '../../hooks/useScreen'
import LanguageDropdown from './LanguageDropdown'
import logo from '../../assets/images/logo.png'
import heart from '../../assets/icons/ukraine.svg'
import ThemeToggle from './ThemeToggle'
import { Button } from '../ui'
import { FiMoreVertical } from 'react-icons/fi'
import ProfileButton from './ProfileButton'
import CurrencyDropdown from './CurrencyDropdown'
import cn from 'classnames'

const Navbar = () => {
    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const { isMinTablet, isMinPC } = useScreen()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleScroll = (e) => setOpen(false)
        const handleClickOutside = (e) => {
            if (!e.target.closest('.nav-toggle')) setOpen(false)
        }

        document.addEventListener('click', handleClickOutside)
        document.addEventListener('scroll', handleScroll)

        return () => {
            document.removeEventListener('click', handleClickOutside)
            document.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <nav
            className={cn(
                'sticky left-0 top-0 z-[99] w-full bg-white dark:bg-zinc-800',
                isMinTablet ? 'shadow-lg' : ''
            )}
            aria-label="website navigation bar"
        >
            <ul
                className="container mx-auto flex h-16 items-center bg-white pl-5 dark:bg-zinc-800 md:gap-4 md:px-5 lg:gap-6"
                aria-label="navigation bar items list"
            >
                <li className="flex items-center gap-1 max-md:mr-auto">
                    <Link
                        className="hover:text-accent-orange/[0.8] flex items-center gap-2 font-bolditalic text-3xl text-accent-orange"
                        to="/"
                    >
                        {isMinTablet ? (
                            'Grocket'
                        ) : (
                            <img
                                className="h-10"
                                src={logo}
                                alt="grocket logo"
                            />
                        )}
                    </Link>
                    <Link
                        to="https://www.standwithukraine.how"
                        target="_blank"
                        className="mb-auto"
                    >
                        <img
                            src={heart}
                            className="mb-auto aspect-square w-4 md:w-5"
                            alt="heart with ukranian flag background"
                        />
                    </Link>
                </li>

                {isMinTablet && (
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
                )}
                {user ? (
                    <li>
                        <ProfileButton />
                    </li>
                ) : (
                    <>
                        {isMinPC && (
                            <li>
                                <NavLink
                                    to="/register"
                                    className={({ isActive }) =>
                                        cn(
                                            'flex h-12 items-center gap-2 rounded-lg px-3 hover:md:bg-slate-100 hover:dark:md:bg-zinc-700',
                                            isActive
                                                ? 'bg-slate-100 dark:bg-zinc-700'
                                                : ''
                                        )
                                    }
                                >
                                    <FiUserPlus />
                                    {t('register')}
                                </NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    cn(
                                        'flex h-12 items-center gap-2 rounded-lg px-3 max-md:mr-1 hover:md:bg-slate-100 hover:dark:md:bg-zinc-700',
                                        isActive
                                            ? 'bg-slate-100 dark:bg-zinc-700'
                                            : ''
                                    )
                                }
                            >
                                <FiLogIn />
                                {t('login')}
                            </NavLink>
                        </li>
                    </>
                )}
                <li>
                    <Link
                        className="hover:bg-accent-orange/[0.8] flex h-12 items-center gap-2 whitespace-nowrap rounded-xl bg-accent-orange px-2 text-lg font-bold text-white md:px-6"
                        to="/sell"
                    >
                        {isMinTablet ? t('sell_item') : t('sell')}
                        <MdOutlineSell />
                    </Link>
                </li>
                {!isMinTablet && (
                    <li>
                        <Button
                            onClick={() => setOpen((prevState) => !prevState)}
                            border={false}
                            px={3}
                            height={10}
                            className="nav-toggle pr-3 sm:px-4"
                            ariaLabel="open navbar"
                        >
                            <FiMoreVertical />
                        </Button>
                    </li>
                )}
            </ul>
            {!isMinTablet && (
                <div
                    className={cn(
                        'nav-toggle absolute -z-40 h-10 w-full bg-white shadow-lg transition-[top] dark:bg-zinc-800',
                        open ? 'top-16' : 'top-6'
                    )}
                >
                    <ul
                        className={cn(
                            'container mx-auto flex items-center gap-3 px-5 transition-opacity',
                            open ? 'opacity-100' : 'opacity-0'
                        )}
                    >
                        <li>
                            <LanguageDropdown />
                        </li>
                        <li>
                            <CurrencyDropdown />
                        </li>
                        <li className="mr-auto h-full">
                            <ThemeToggle />
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    )
}

export default Navbar
