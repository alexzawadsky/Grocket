import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'
import AuthContext from '../contexts/AuthProvider'
import { Title } from './'

const PrivateRoute = ({ children }) => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)

    return (
        <>
            {user ?
                children ? children : <Outlet />
                :
                <div className='flex flex-col gap-5 items-center justify-center h-full'>
                    <Title text={t('login_to_see')} />
                    <NavLink className='bg-accent-orange font-bold py-3 w-fit px-5 rounded-xl text-white' to='/login'>{t('login')}</NavLink>
                </div>}
        </>
    )
}

export default PrivateRoute