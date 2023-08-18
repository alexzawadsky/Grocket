import { Link, NavLink } from 'react-router-dom'
import { MdOutlineSell } from 'react-icons/md'
import AuthContext from '../../contexts/AuthProvider'
import { useContext, useEffect, useState } from 'react'
import { FiLogIn, FiUserPlus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import useScreen from '../../hooks/useScreen'
import LanguageDropdown from './LanguageDropdown'
import ThemeToggle from './ThemeToggle'
import { Button } from '../ui'
import { FiMoreVertical } from 'react-icons/fi'
import ProfileButton from './ProfileButton'
import CurrencyDropdown from './CurrencyDropdown'
import cn from 'classnames'
import HomeButton from './HomeButton'
import NavbarDropdowns from './NavbarDropdowns'

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
            className="sticky left-0 top-0 z-[99] w-full bg-white dark:bg-zinc-800 md:shadow-lg"
            aria-label="website navigation bar"
        >
            <ul
                className="container mx-auto flex h-16 items-center bg-white pl-5 dark:bg-zinc-800 md:gap-4 md:px-5 lg:gap-6"
                aria-label="navigation bar items list"
            >
                <HomeButton />
                {isMinTablet && <NavbarDropdowns />}
                {user ? (
                    <li>
                        <ProfileButton />
                    </li>
                ) : (
                    <>
                        <li className="hidden lg:block">
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
                <li className="block md:hidden">
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
            </ul>
            <div
                className={cn(
                    'nav-toggle absolute -z-40 block h-10 w-full bg-white shadow-lg transition-[top] dark:bg-zinc-800 md:hidden',
                    open ? 'top-16' : 'top-6'
                )}
            >
                <ul
                    className={cn(
                        'container mx-auto flex items-center gap-3 px-5 transition-opacity',
                        open ? 'opacity-100' : 'opacity-0'
                    )}
                >
                    <NavbarDropdowns />
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
