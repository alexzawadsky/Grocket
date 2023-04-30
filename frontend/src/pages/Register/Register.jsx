import { useState, useRef, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../../contexts/AuthProvider'
import { ProfileCard } from '../../components'
import useScreen from '../../hooks/useScreen'
import { useTranslation } from 'react-i18next'
import CreateUserForm from '../../forms/CreateUserForm'
import { Title, Button, Form } from '../../components/ui'
import { Helmet } from 'react-helmet-async'

const Register = () => {
    const { t } = useTranslation()
    const { registerUser } = useContext(AuthContext)

    const [formData, setFormData] = useState()
    const [valid, setValid] = useState(null)

    const { isMinPC, isMinTablet, isLargePC } = useScreen()

    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        registerUser(formData)
        setLoading(false)
    }

    return (
        <>
            <Helmet>
                <title>Register - Grocket</title>
            </Helmet>
            <div className="flex h-full md:items-center">
                <div className="mx-auto grid w-full gap-10 md:w-fit md:grid-cols-[300px_400px] lg:grid-cols-[300px_450px] xl:grid-cols-[300px_500px]">
                    {isMinTablet && (
                        <div className="ml-auto w-fit">
                            <ProfileCard
                                id={0}
                                firstName={formData?.first_name}
                                lastName={formData?.last_name}
                                email={formData?.email}
                                phone={formData?.phone}
                                rating={5.0}
                                avatar={formData?.avatar}
                                withComments={false}
                                withPhone={false}
                                country="US"
                            />
                        </div>
                    )}
                    <Form
                        onSubmit={handleSubmit}
                        className="mx-auto mt-8 grid h-fit w-full max-w-[400px] gap-3 md:my-auto md:mr-auto lg:max-w-[550px]"
                    >
                        <Title className="px-5" text={t('create_acc')} />
                        <div className="rounded-xl border p-5 shadow-md dark:border-2 dark:border-zinc-600">
                            <CreateUserForm
                                setFormData={setFormData}
                                setValid={setValid}
                            />
                            <Button
                                className="mt-5"
                                height={10}
                                px={5}
                                color="accent-orange"
                                style="fill"
                                width="fit"
                                disabled={!valid}
                            >
                                {t('register')}
                            </Button>
                        </div>
                        <p className="ml-5 flex gap-2">
                            {t('already_have_acc')}?
                            <NavLink
                                to="/login"
                                className="text-accent-orange underline"
                            >
                                {t('login')}
                            </NavLink>
                        </p>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Register
