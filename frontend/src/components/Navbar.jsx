import React from 'react'
import { NavLink } from 'react-router-dom'
import { BsPersonFill } from 'react-icons/bs'
import { MdOutlineSell } from 'react-icons/md'
import AuthContext from '../contexts/AuthProvider'
import { useContext } from 'react'
import { BsFillPersonPlusFill } from 'react-icons/bs'
import { FiLogIn } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import useScreen from '../hooks/useScreen'
import langs from '../assets/localization.json'
import LanguageDropdown from './LanguageDropdown'


const Navbar = () => {


    const { t, i18n } = useTranslation()
    const { user } = useContext(AuthContext)
    const { isMinTablet } = useScreen()

    const changeLang = (e) => {
        i18n.changeLanguage(e.target.value)
    }

    return (
        <nav className='w-full fixed z-50 left-0 top-0 bg-white shadow-lg'>
            <div className='flex container px-5 mx-auto gap-5 md:gap-10 h-16 items-center'>
                <NavLink className='text-3xl font-bolditalic text-accent-orange hover:text-accent-orange/[0.8] flex items-center gap-2' to='/'>
                    {!isMinTablet && <img className='h-10' src='/images/logo.png' />}
                    {isMinTablet && 'Grocket'}
                </NavLink>
                <LanguageDropdown />
                {
                    user ?
                        <NavLink className='flex items-center gap-2 h-10' to='/users/me'><BsPersonFill />{isMinTablet && t('profile')}</NavLink>
                        :
                        <>
                            {isMinTablet ? <NavLink to='/register' className='flex items-center gap-2 border-2 border-accent-orange text-accent-orange py-3 px-5 rounded-xl'><BsFillPersonPlusFill />{t('register')}</NavLink> : null}
                            <NavLink to='/login' className='flex items-center gap-3'><FiLogIn />{t('login')}</NavLink>
                        </>

                }
                <NavLink className='px-6 h-12 gap-2 bg-accent-orange rounded-xl hover:bg-accent-orange/[0.8] flex items-center text-white text-lg font-bold' to='/sell'>{isMinTablet ? t('sell_item') : t('sell')}<MdOutlineSell /></NavLink>
            </div>
        </nav>
    )
}

export default Navbar