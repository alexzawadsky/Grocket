import { Link } from 'react-router-dom'
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
import { GoKebabVertical } from 'react-icons/go'
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
        <nav className={cn(
            'w-full sticky z-[99] left-0 top-0 bg-white dark:bg-zinc-800',
            isMinTablet ? 'shadow-lg' : ''
        )} aria-label='website navigation bar'>
            <ul className='flex container pl-5 md:px-5 mx-auto md:gap-4 lg:gap-6 h-16 items-center bg-white dark:bg-zinc-800' aria-label='navigation bar items list'>
                <li className="flex items-center gap-1 max-md:mr-auto">
                    <Link className='text-3xl font-bolditalic text-accent-orange hover:text-accent-orange/[0.8] flex items-center gap-2' to='/'>
                        {isMinTablet ? 'Grocket' : <img className='h-10' src={logo} alt='grocket logo' />}
                    </Link>
                    <a
                        href='https://www.standwithukraine.how/'
                        target='_blank'
                        className='mb-auto'
                    >
                        <img
                            src={heart}
                            className='w-4 md:w-5 aspect-square mb-auto'
                            alt='heart with ukranian flag background'
                        />
                    </a>
                </li>
                {isMinTablet && <>
                    <li>
                        <LanguageDropdown />
                    </li>
                    <li>
                        <CurrencyDropdown />
                    </li>
                    <li className='mr-auto'>
                        <ThemeToggle />
                    </li>
                </>}
                {user ?
                    <li>
                        <ProfileButton />
                    </li>
                    :
                    <>
                        {isMinPC && <li>
                            <Link to='/register' className='flex items-center gap-2 hover:md:bg-slate-100 hover:dark:md:bg-zinc-700 h-12 px-3 rounded-lg'>
                                <FiUserPlus />{t('register')}
                            </Link>
                        </li>}
                        <li>
                            <Link to='/login' className='flex items-center gap-2 hover:md:bg-slate-100 hover:dark:md:bg-zinc-700 h-12 px-3 rounded-lg'>
                                <FiLogIn />{t('login')}
                            </Link>
                        </li>
                    </>
                }
                <li>
                    <Link className='px-2 md:px-6 h-12 gap-2 bg-accent-orange rounded-xl hover:bg-accent-orange/[0.8] flex items-center text-white text-lg font-bold whitespace-nowrap' to='/sell'>
                        {isMinTablet ? t('sell_item') : t('sell')}<MdOutlineSell />
                    </Link>
                </li>
                {!isMinTablet && <Button
                    onClick={() => setOpen(prevState => !prevState)}
                    border={false}
                    px={3}
                    height={10}
                    className='nav-toggle pr-3 sm:px-4'
                >
                    <GoKebabVertical />
                </Button>}
            </ul>
            {!isMinTablet && <div className={cn(
                'transition-[top] w-full nav-toggle absolute h-10 bg-white dark:bg-zinc-800 shadow-lg -z-40',
                open ? 'top-16' : 'top-6'
            )}>
                <ul className={cn(
                    'flex container items-center px-5 gap-3 mx-auto transition-opacity',
                    open ? 'opacity-100' : 'opacity-0'
                )}>
                    <li>
                        <LanguageDropdown />
                    </li>
                    <li>
                        <CurrencyDropdown />
                    </li>
                    <li className='mr-auto h-full'>
                        <ThemeToggle />
                    </li>
                </ul>
            </div>}
        </nav>
    )
}

export default Navbar