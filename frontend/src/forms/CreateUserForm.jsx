import useInput from "../hooks/useInput"
import { Input } from "../components/ui"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"

const CreateUserForm = ({ setFormData, setValid }) => {

    const firstName = useInput('')
    const lastName = useInput('', {})
    const email = useInput('', {})
    const password = useInput('', {})

    const { t } = useTranslation()

    useEffect(() => {
        setValid([firstName, lastName, email, password]
            .every(el => el.allValid && el?.value.length > 0))
        setFormData({
            first_name: firstName.value,
            last_name: lastName.value,
            email: email.value,
            password: password.value
        })
    }, [firstName.value, lastName.value, email.value, password.value])

    return (
        <div className="grid md:grid-cols-2 gap-2">
            <Input
                title={t('first_name')}
                instance={firstName}
                must
                autoRef
            />
            <Input
                title={t('last_name')}
                instance={lastName}
                must
            />
            <div className="col-span-full">
                <Input
                    title={t('email')}
                    instance={email}
                    must
                />
            </div>
            <Input
                title={t('password')}
                instance={password}
                type='password'
                must
            />
        </div>
    )
}

export default CreateUserForm