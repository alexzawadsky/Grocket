import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'
import AuthContext from '../../contexts/AuthProvider'
import { Title } from '../ui'

const PrivateRoute = ({ children }) => {
    const { t } = useTranslation()
    const { user } = useContext(AuthContext)

    return (
        <>
            {user ? (
                children ? (
                    children
                ) : (
                    <Outlet />
                )
            ) : (
                <div className="flex h-full flex-col items-center justify-center gap-5">
                    <Title text={t('login_to_see')} />
                    <NavLink
                        className="w-fit rounded-xl bg-accent-orange px-5 py-3 font-bold text-white"
                        to="/login"
                    >
                        {t('login')}
                    </NavLink>
                </div>
            )}
        </>
    )
}

export default PrivateRoute
