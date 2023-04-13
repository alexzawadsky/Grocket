import { NavLink } from 'react-router-dom'
import { MdOutlineSell } from 'react-icons/md'
import AuthContext from '../../contexts/AuthProvider'
import { useContext, useEffect, useState } from 'react'
import { FiLogIn, FiUserPlus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import useScreen from '../../hooks/useScreen'
import LanguageDropdown from './LanguageDropdown'
import logo from '../../assets/logo.png'
import heart from '../../assets/icons/ukraine.svg'
import Avatar from '../ui/Avatar'
import ThemeToggle from './ThemeToggle'
import { Button } from '../ui'
import { GoKebabVertical } from 'react-icons/go'
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
            document.removeEventListener('click', handleScroll)
        }
    }, [])

    return (
        <nav className='w-full fixed z-50 left-0 top-0 shadow-lg bg-white dark:bg-zinc-800' aria-label='website navigation bar'>
            <ul className='flex container pl-5 md:px-5 mx-auto md:gap-4 lg:gap-6 h-16 items-center' aria-label='navigation bar items list'>
                <li className="flex items-center gap-1 max-md:mr-auto">
                    <NavLink className='text-3xl font-bolditalic text-accent-orange hover:text-accent-orange/[0.8] flex items-center gap-2' to='/'>
                        {isMinTablet ? 'Grocket' : <img className='h-10' src={logo} alt='grocket logo' />}
                    </NavLink>
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
                    <li className='mr-auto'>
                        <ThemeToggle />
                    </li>
                </>}
                {user ?
                    <li>
                        <NavLink className='flex items-center gap-2 h-10 font-bold max-md:mr-4' to='/users/me'>
                            <Avatar
                                avatar={user?.avatar}
                                alt={`${user?.name} avatar`}
                                width={40}
                                height={40}
                            />
                            {isMinTablet && 'Timur'}
                            {/* {isMinTablet && user?.name} */}
                        </NavLink>
                    </li>
                    :
                    <>
                        {isMinPC && <li>
                            <NavLink to='/register' className='flex items-center gap-2 hover:md:bg-slate-100 hover:dark:md:bg-zinc-700 h-12 px-3 rounded-lg'>
                                <FiUserPlus />{t('register')}
                            </NavLink>
                        </li>}
                        <li>
                            <NavLink to='/login' className='flex items-center gap-2 hover:md:bg-slate-100 hover:dark:md:bg-zinc-700 h-12 px-3 rounded-lg'>
                                <FiLogIn />{t('login')}
                            </NavLink>
                        </li>
                    </>
                }
                <li>
                    <NavLink className='px-2 md:px-6 h-12 gap-2 bg-accent-orange rounded-xl hover:bg-accent-orange/[0.8] flex items-center text-white text-lg font-bold whitespace-nowrap' to='/sell'>
                        {isMinTablet ? t('sell_item') : t('sell')}<MdOutlineSell />
                    </NavLink>
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
            {(!isMinTablet && open) && <ul className={cn(
                'flex container items-center px-5 gap-3 mx-auto nav-toggle',
                (!isMinTablet && open) && ''
            )}>
                <li>
                    <LanguageDropdown />
                </li>
                <li className='mr-auto h-full'>
                    <ThemeToggle />
                </li>
            </ul>}
        </nav>
    )
}

export default Navbar