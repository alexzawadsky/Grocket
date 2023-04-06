import React from 'react'
import { useRef, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useSearchParams } from 'react-router-dom'
import { Input, Form, Title, Button } from '../../components/ui'
import AuthContext from '../../contexts/AuthProvider'
import useInput from '../../hooks/useInput'

const Login = () => {

    const { t } = useTranslation()
    const { loginUser } = useContext(AuthContext)

    const [searchParams, setSearchParams] = useSearchParams()

    const email = useInput('')
    const password = useInput('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    const handleSubmit = () => {
        setLoading(true)
        const data = {
            email: email.value,
            password: password.value,
            redirectFrom: searchParams.get('redirectFrom') || '/'
        }
        loginUser(data, setError)
        setLoading(false)
    }

    return (
        <div className='w-full h-full flex pt-8 md:pt-0 md:items-center justify-center'>
            <div className='max-sm:max-w-[400px] w-full md:w-1/2 lg:w-1/3 xl:w-1/4'>
                <Title
                    className='ml-5 mb-3'
                    size='4xl'
                    color='accent-orange'
                    text='Grocket'
                    italic
                />
                <Form className='grid gap-1 md:gap-2 shadow-md rounded-xl p-5 border' onSubmit={handleSubmit}>
                    <Input
                        title={t('email')}
                        type='text'
                        instance={email}
                    />
                    <Input
                        title={t('password')}
                        type='password'
                        instance={password}
                    />
                    <Button
                        type='submit'
                        disabled={email.value === '' || password.value === ''}
                        className='mt-2'
                        color='accent-orange'
                        style='fill'
                        width='fit'
                        height={10}
                        px={5}
                    >
                        {!loading ? t('login') : `${t('loading')}...`}
                    </Button>
                    {(error && error.status === 401) &&
                        <NavLink to='/password-reset' className='hover:text-accent-orange'>
                            {t('reset_pass')}
                        </NavLink>}
                </Form>
                <p className="flex gap-2 mt-2 ml-5">
                    {t('dont_have_acc')}?
                    <NavLink className='underline text-accent-orange' to='/register'>{t('register')}</NavLink>
                </p>
            </div>
        </div>
    )
}

export default Login