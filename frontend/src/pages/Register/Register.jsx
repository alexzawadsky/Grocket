import React, { useState, useRef, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { BsFillTrashFill } from 'react-icons/bs'
import AuthContext from '../../contexts/AuthProvider'
import { toBase64 } from "../../utils";
import { AvatarCrop, ProfileCard, Title } from '../../components'
import { useMediaQuery } from 'react-responsive';
import useScreen from '../../hooks/useScreen';
import { useTranslation } from 'react-i18next';
import CreateUserForm from '../../forms/CreateUserForm';

const Register = () => {

    const { t } = useTranslation()
    const { registerUser } = useContext(AuthContext)

    const [formData, setFormData] = useState()
    const [valid, setValid] = useState(null)

    const { isMinPC, isMinTablet, isLargePC } = useScreen()

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        registerUser(formData)
        setLoading(false)
    }

    return (
        <div className='flex h-full md:items-center'>
            <div className="grid w-full md:w-fit md:grid-cols-[300px_400px] lg:grid-cols-[300px_450px] xl:grid-cols-[300px_500px] gap-10 mx-auto">
                {isMinTablet && <div className='ml-auto w-fit'><ProfileCard
                    id={0}
                    firstName={formData?.first_name}
                    lastName={formData?.last_name}
                    email={formData?.email}
                    phone={formData?.phone}
                    rating={5.00}
                    avatar={formData?.avatar}
                    withComments={false}
                    withPhone={false}
                /></div>}
                <form onSubmit={handleSubmit} className='w-full max-w-[400px] lg:max-w-[550px] mx-auto mt-8 h-fit md:my-auto md:mr-auto grid gap-3'>
                    <div className="ml-5">
                        <Title text={t('create_acc')} />
                    </div>
                    <div className='p-5 rounded-xl shadow-md border'>
                        <CreateUserForm
                            setFormData={setFormData}
                            setValid={setValid}
                        />
                        <button
                            className='button-fill-orange !w-fit !h-10 mt-5'
                            disabled={!valid}
                        >
                            {t('register')}
                        </button>
                    </div>

                    <div className='flex gap-2 ml-5'>
                        <p>{t('already_have_acc')}?</p>
                        <NavLink to='/login' className='underline text-accent-orange'>{t('login')}</NavLink>
                    </div>
                </form>
            </div>

        </div >
    )
}

export default Register