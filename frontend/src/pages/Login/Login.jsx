import React from 'react'
import { useRef, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useSearchParams } from 'react-router-dom'
import { Input, Form, Title, Button } from '../../components/ui'
import AuthContext from '../../contexts/AuthProvider'
import useInput from '../../hooks/useInput'
import logo from '../../assets/images/logo.png'
import { Helmet } from 'react-helmet-async'

const Login = () => {
    const { t } = useTranslation()
    const { loginUser } = useContext(AuthContext)

    const [searchParams, setSearchParams] = useSearchParams()

    const email = useInput('')
    const password = useInput('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    const handleSubmit = () => {
        if (email.value === '' || password.value === '') return
        setLoading(true)
        const data = {
            email: email.value,
            password: password.value,
            redirectFrom: searchParams.get('redirectFrom') || '/',
        }
        loginUser(data, setError)
        setLoading(false)
    }

    return (
        <>
            <Helmet>
                <title>Sign in - Grocket</title>
            </Helmet>
            <div className="flex h-full w-full justify-center md:items-center">
                <div className="w-[400px]">
                    <img
                        className="mx-auto my-7"
                        width={35}
                        height={35}
                        src={logo}
                    />
                    <Title
                        className="mb-5 text-center"
                        text={t('login_to_acc')}
                    />
                    <Form
                        className="grid gap-1 rounded-xl border p-5 shadow-md dark:border-2 dark:border-zinc-600 md:gap-2"
                        onSubmit={handleSubmit}
                        errors={error?.data}
                    >
                        <Input
                            name="email"
                            autoRef
                            title={t('email')}
                            type="text"
                            instance={email}
                        />
                        <Input
                            name="password"
                            title={t('password')}
                            type="password"
                            instance={password}
                        />
                        {/* <div className="flex mt-2 items-center">
                        <input
                            id='remember-me'
                            type='checkbox'
                            className='w-4 h-4 checked:!bg-accent-orange'
                        />
                        <label htmlFor="remember-me" className='pl-2'>{t('remember_me')}</label>
                        <NavLink to='' className='ml-auto text-accent-orange'>
                            {t('forgot_password')}?
                        </NavLink>
                    </div> */}
                        <Button
                            type="submit"
                            className="mt-2"
                            color="accent-orange"
                            style="fill"
                            width="full"
                            height={10}
                            px={5}
                        >
                            {!loading ? t('login') : `${t('loading')}...`}
                        </Button>
                        {error && error.status === 401 && (
                            <NavLink
                                to="/password-reset"
                                className="hover:text-accent-orange"
                            >
                                {t('reset_pass')}
                            </NavLink>
                        )}
                    </Form>
                    <p className="mx-5 mt-2 flex gap-2">
                        {t('dont_have_acc')}?
                        <NavLink
                            className="text-accent-orange underline"
                            to="/register"
                        >
                            {t('register')}
                        </NavLink>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login
