import { NavLink } from 'react-router-dom'
import { MdOutlineSell } from 'react-icons/md'
import AuthContext from '../../contexts/AuthProvider'
import { useContext } from 'react'
import { FiLogIn, FiUserPlus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import useScreen from '../../hooks/useScreen'
import LanguageDropdown from './LanguageDropdown'
import logo from '../../assets/logo.png'
import heart from '../../assets/icons/ukraine.svg'
import Avatar from '../ui/Avatar'

const Navbar = () => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const { isMinTablet } = useScreen()

    return (
        <nav className='w-full fixed z-50 left-0 top-0 bg-white shadow-lg'>
            <ul className='flex container px-5 mx-auto gap-2 md:gap-5 h-16 items-center'>
                <li className="flex items-center gap-1">
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
                <li className='mr-auto'>
                    <LanguageDropdown />
                </li>
                {user ?
                    <li>
                        <NavLink className='flex items-center gap-2 h-10 font-bold' to='/users/me'>
                            <Avatar
                                avatar={user?.avatar}
                                alt={`${user?.name}`}
                                width={40}
                                height={40}
                            />
                            {isMinTablet && 'Timur'}
                            {/* {isMinTablet && user?.name} */}
                        </NavLink>
                    </li>
                    :
                    <>
                        {isMinTablet && <li>
                            <NavLink to='/register' className='flex items-center gap-2 hover:md:bg-slate-100 h-12 px-3 rounded-lg'>
                                <FiUserPlus />{t('register')}
                            </NavLink>
                        </li>}
                        <li>
                            <NavLink to='/login' className='flex items-center gap-2 hover:md:bg-slate-100 h-12 px-3 rounded-lg'>
                                <FiLogIn />{t('login')}
                            </NavLink>
                        </li>
                    </>
                }
                <li>
                    <NavLink className='px-6 h-12 gap-2 bg-accent-orange rounded-xl hover:bg-accent-orange/[0.8] flex items-center text-white text-lg font-bold' to='/sell'>
                        {isMinTablet ? t('sell_item') : t('sell')}<MdOutlineSell />
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar