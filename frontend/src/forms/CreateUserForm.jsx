import useInput from '../hooks/useInput'
import { Input } from '../components/ui'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

const CreateUserForm = ({ setFormData, setValid, errors }) => {
    const firstName = useInput('')
    const lastName = useInput('', {})
    const email = useInput('', {})
    const password = useInput('', {})

    const { t } = useTranslation()

    useEffect(() => {
        setValid(
            [firstName, lastName, email, password].every(
                (el) => el.allValid && el?.value.length > 0
            )
        )
        setFormData({
            first_name: firstName.value,
            last_name: lastName.value,
            email: email.value,
            password: password.value,
        })
    }, [firstName.value, lastName.value, email.value, password.value])

    return (
        <div className="grid gap-2 md:grid-cols-2">
            <Input
                name="first_name"
                title={t('first_name')}
                instance={firstName}
                must
                autoRef
                hasError={errors['first_name']}
            />
            <Input
                name="last_name"
                title={t('last_name')}
                instance={lastName}
                must
                hasError={errors['last_name']}
            />
            <div className="col-span-full">
                <Input
                    name="email"
                    title={t('email')}
                    instance={email}
                    must
                    hasError={errors['email']}
                />
            </div>
            <Input
                name="password"
                title={t('password')}
                instance={password}
                type="password"
                must
                hasError={errors['password']}
            />
        </div>
    )
}

export default CreateUserForm
