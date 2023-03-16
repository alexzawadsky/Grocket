import React from 'react'
import { NavLink } from 'react-router-dom'
import { BsPersonFill } from 'react-icons/bs'
import { MdOutlineSell } from 'react-icons/md'
import AuthContext from '../contexts/AuthProvider'
import { useContext } from 'react'
import { BsFillPersonPlusFill } from 'react-icons/bs'
import { FiLogIn } from 'react-icons/fi'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'

const Navbar = () => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })

    return (
        <nav className='w-full fixed z-50 left-0 top-0 bg-white shadow-lg'>
            <div className='flex container px-5 mx-auto gap-3 md:gap-10 h-16 items-center'>
                <NavLink className='mr-auto text-3xl font-bolditalic text-accent-orange hover:text-accent-orange/[0.8] flex items-center gap-2' to='/'>
                    {/* <img className='h-12' src='/images/logo.png' /> */}
                    {isTablet && 'Grocket'}
                </NavLink>
                {
                    user ?
                        <NavLink className='flex items-center gap-2 h-10' to='/users/me'><BsPersonFill />{t('profile')}</NavLink>
                        :
                        <>
                            {isTablet ? <NavLink to='/register' className='flex items-center gap-2 border-2 border-accent-orange text-accent-orange py-3 px-5 rounded-xl'><BsFillPersonPlusFill />{t('register')}</NavLink> : null}
                            <NavLink to='/login' className='flex items-center gap-3'><FiLogIn />{t('login')}</NavLink>
                        </>

                }
                <NavLink className='px-6 h-12 gap-2 bg-accent-orange rounded-xl hover:bg-accent-orange/[0.8] flex items-center text-white text-lg font-bold' to='/sell'>{isTablet ? t('sell_item') : t('sell')}<MdOutlineSell /></NavLink>
            </div>
        </nav>
    )
}

export default Navbar