import React from 'react'
import { useRef, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useSearchParams } from 'react-router-dom'
import AuthContext from '../../contexts/AuthProvider'

const Login = () => {

    const { t } = useTranslation()
    const { loginUser } = useContext(AuthContext)

    const [searchParams, setSearchParams] = useSearchParams()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    const handleSubmit = (e) => {
        setLoading(true)
        e.preventDefault()
        const data = {
            email,
            password,
            redirectFrom: searchParams.get('redirectFrom') || '/'
        }
        loginUser(data, setError)
        setLoading(false)
    }

    return (
        <div className='w-full h-full flex pt-8 md:pt-0 md:items-center justify-center'>
            <div className='max-sm:max-w-[400px] w-full md:w-1/2 lg:w-1/3 xl:w-1/4'>
                <h1 className='text-accent-orange text-4xl ml-5 font-bolditalic pb-1 md:pb-3'>Grocket</h1>
                <form className='grid gap-1 md:gap-2' onSubmit={handleSubmit}>
                    <div className='grid gap-1 md:gap-2 shadow-md rounded-xl p-5'>
                        <div className='w-full grid gap-1'>
                            <label className='text-md' htmlFor="email">{t('email')}:</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                className='grocket-input'
                                type="text"
                                id='email'
                            />
                        </div>
                        <div className='w-full grid gap-1'>
                            <label className='text-md' htmlFor="email">{t('password')}:</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                className='grocket-input'
                                type="password"
                                id='email'
                            />
                        </div>
                    </div>
                    <button
                        disabled={email === '' || password === ''}
                        className='button-fill-orange !h-10 mt-2 ml-5'
                    >
                        {!loading ? t('login') : `${t('loading')}...`}
                    </button>
                    {/* {error ? <p className='text-accent-red font-bold'>{error.status} {error.message}</p> : null} */}
                    {error && error.status === 401 ? <NavLink to='/password-reset' className='hover:text-accent-orange'>{t('reset_pass')}</NavLink> : null}
                    <div className="flex gap-2 mt-2 ml-5">
                        {t('dont_have_acc')}?
                        <NavLink className='underline text-accent-orange' to='/register'>{t('register')}</NavLink>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login