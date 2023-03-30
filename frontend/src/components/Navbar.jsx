import { NavLink } from 'react-router-dom'
import { BsPersonFill } from 'react-icons/bs'
import { MdOutlineSell } from 'react-icons/md'
import AuthContext from '../contexts/AuthProvider'
import { useContext } from 'react'
import { FiLogIn, FiUserPlus } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import useScreen from '../hooks/useScreen'
import LanguageDropdown from './LanguageDropdown'
import logo from '../assets/logo.png'

const Navbar = () => {


    const { t, i18n } = useTranslation()
    const { user } = useContext(AuthContext)
    const { isMinTablet } = useScreen()

    const changeLang = (e) => {
        i18n.changeLanguage(e.target.value)
    }

    return (
        <nav className='w-full fixed z-50 left-0 top-0 bg-white shadow-lg'>
            <div className='flex container px-5 mx-auto gap-2 md:gap-10 h-16 items-center'>
                <NavLink className='text-3xl font-bolditalic text-accent-orange hover:text-accent-orange/[0.8] flex items-center gap-2' to='/'>
                    {isMinTablet ? 'Grocket' : <img className='h-10' src={logo} />}
                </NavLink>
                <LanguageDropdown />
                {user ?
                    <NavLink
                        className='flex items-center gap-2 h-10'
                        to='/users/me'
                    >
                        <BsPersonFill />{isMinTablet && t('profile')}
                    </NavLink>
                    :
                    <div className='flex items-center gap-2'>
                        {isMinTablet &&
                            <NavLink to='/register' className='flex items-center gap-2 hover:md:bg-slate-100 h-12 px-3 rounded-lg'>
                                <FiUserPlus />{t('register')}
                            </NavLink>}
                        <NavLink to='/login' className='flex items-center gap-2 hover:md:bg-slate-100 h-12 px-3 rounded-lg'>
                            <FiLogIn />{t('login')}
                        </NavLink>
                    </div>

                }
                <NavLink className='px-6 h-12 gap-2 bg-accent-orange rounded-xl hover:bg-accent-orange/[0.8] flex items-center text-white text-lg font-bold' to='/sell'>
                    {isMinTablet ? t('sell_item') : t('sell')}<MdOutlineSell />
                </NavLink>
            </div>
        </nav>
    )
}

export default Navbar