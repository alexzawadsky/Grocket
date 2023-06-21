import { createContext, useState, useEffect, useContext } from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import { alertErr, getCookie, notification } from '../utils'
import { useQueryClient } from '@tanstack/react-query'
import SearchHistoryContext from './HistoryContext'
import localizations from '../assets/json/localization.json'
import api from '../api/api'
import { useTranslation } from 'react-i18next'
import { capitalizeName } from '../utils'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {
    const { i18n } = useTranslation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens')
            ? JSON.parse(localStorage.getItem('authTokens'))
            : null
    )

    const [user, setUser] = useState(() =>
        localStorage.getItem('authTokens')
            ? jwt_decode(localStorage.getItem('authTokens'))
            : null
    )

    const loginUser = async ({ email, password, redirectFrom }, setError) => {
        api.post(
            '/api/v1/auth/jwt/create',
            JSON.stringify({ email, password }),
            {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language':
                        localizations[i18n.resolvedLanguage.toLocaleUpperCase()]
                            .codeForAPI,
                },
            }
        )
            .then((res) => {
                setAuthTokens(res.data)
                localStorage.setItem('authTokens', JSON.stringify(res.data))
                navigate(redirectFrom)
            })
            .catch((err) => {
                setError({
                    status: err.response.status,
                    message: err.response.data,
                })
                alertErr(err)
            })
    }

    const registerUser = (
        {
            first_name,
            last_name,
            username,
            email,
            password,
            re_password,
            phone,
            country,
            avatar,
        },
        setError
    ) => {
        api.post(
            '/api/v1/users/',
            JSON.stringify({
                first_name: capitalizeName(first_name),
                last_name: capitalizeName(last_name),
                username,
                email,
                password,
                re_password,
                country,
                phone,
                avatar,
            }),
            {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Accept-Language':
                        localizations[i18n.resolvedLanguage.toLocaleUpperCase()]
                            .codeForAPI,
                },
            }
        )
            .then((res) => {
                notification(res.data.message)
                loginUser({ email, password, redirectFrom: '/users/me' })
            })
            .catch((err) => setError(err))
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('lookHistory')
        localStorage.removeItem('languageSelected')
        queryClient.clear()
        localStorage.removeItem('authTokens')
        localStorage.removeItem('accentColor')
        localStorage.removeItem('searchHistory')
        navigate('/login')
    }

    const contextData = {
        user,
        setUser,
        loginUser,
        registerUser,
        authTokens,
        setAuthTokens,
        logoutUser,
    }

    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access))
        }
    }, [authTokens])

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
