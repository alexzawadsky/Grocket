import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useOutlet } from 'react-router-dom'
import { Input, Spinner, Title, Button, Form } from '../../components/ui'
import { AvatarCrop } from '../../components'
import { MdPassword } from 'react-icons/md'
import { BsPersonBoundingBox, BsPersonLinesFill, BsArrowLeft, BsFillPersonXFill } from 'react-icons/bs'
import useAxios from '../../hooks/useAxios'
import { alertErr, info, toBase64 } from '../../utils'
import useInput from '../../hooks/useInput'
import AuthContext from '../../contexts/AuthProvider'
import { useProfile, useUpdatePassword, useUpdateProfile } from '../../api/api'
import BackToProfile from './BackToProfile'
import { useTranslation } from 'react-i18next'


const BackButton = () => {

    const { t } = useTranslation()

    return (
        <NavLink className='hover:text-accent-orange flex gap-2 items-center' to='/users/me/settings'><BsArrowLeft />{t('back_to_settings')}</NavLink>
    )
}

export const PasswordReset = () => {

    const { t } = useTranslation()
    const oldPwd = useInput('', { isEmpty: true })
    const newPwd = useInput('', { isEmpty: true })
    const repeatNewPwd = useInput('', { isEmpty: true })

    const updatePasswordMutation = useUpdatePassword()

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            new_password: newPwd.value,
            re_new_password: repeatNewPwd.value,
            current_password: oldPwd.value
        }
        updatePasswordMutation.mutate(data)
    }

    return (
        <Form onSubmit={handleSubmit} className='grid gap-3 w-full md:w-2/3 lg:w-1/2'>
            <BackButton />
            <h2 className='font-bold text-2xl'>{t('change_pass')}</h2>
            <Input title={t('old_pass')} type='password' instance={oldPwd} must={true} />
            <Input title={t('new_pass')} type='password' instance={newPwd} must={true} />
            <Input title={t('re_new_pass')} type='password' instance={repeatNewPwd} must={true} />
            <Button
                disabled={!oldPwd.allValid || !newPwd.allValid || !repeatNewPwd.allValid}
                style='fill'
                width='fit'
                color='accent-orange'
                height={10}
                px={5}
            >
                {updatePasswordMutation.isLoading ? <Spinner /> : t('change_pass')}
            </Button>
        </Form>
    )
}

export const ChangeAvatar = () => {

    const { t } = useTranslation()
    const [imageInInput, setImageInInput] = useState(null)
    const [saved, setSaved] = useState(false)
    const editorRef = useRef()

    const updateProfileMutation = useUpdateProfile()

    const handleAdjSave = async () => {
        let avatar
        if (editorRef) {
            const dataUrl = editorRef.current.getImage().toDataURL()
            const result = await fetch(dataUrl)
            const blob = await result.blob()
            avatar = await toBase64(blob)
        }
        updateProfileMutation.mutate({ avatar })
    }

    return (
        <div className='grid gap-3'>
            <BackButton />
            <h2 className='text-2xl font-bold'>{t('choose_avatar_and_click')} <i>{t('save_adj')}</i></h2>
            <input type="file" onChange={(e) => setImageInInput(e.target.files[0])} />
            <div className="mx-auto md:ml-0 w-fit">
                <AvatarCrop
                    editorRef={editorRef}
                    image={imageInInput}
                    setState={setSaved}
                    adjSaved={saved}
                    onSave={handleAdjSave}
                />
                {updateProfileMutation.isLoading && <Spinner />}
            </div>
        </div>
    )
}

export const UpdateProfile = () => {

    const { t } = useTranslation()
    const { data } = useProfile('me')
    const name = useInput(data?.first_name, { isEmpty: true })
    const lastName = useInput(data?.last_name, { isEmpty: true })
    const username = useInput(data?.username, { isEmpty: true })
    const email = useInput(data?.email, { isEmpty: true })
    const phone = useInput(data?.phone, { isEmpty: true })
    const country = useInput(data?.country, { isEmpty: true })

    const updateProfileMutation = useUpdateProfile()

    const formData = {
        first_name: name.value,
        last_name: lastName.value,
        username: username.value,
        email: email.value,
        phone: phone.value,
        country: country.value
    }

    const handleSubmit = () => {
        const changedFields = Object.entries(formData).filter(([key, value]) => value !== user[key])
        const data = Object.fromEntries(changedFields)
        updateProfileMutation.mutate(data)
    }

    return (
        <div className='grid gap-3 w-full md:w-2/3 lg:w-1/2'>
            <BackButton />
            <h2 className="text-2xl font-bold">{t('change_profile_info')}</h2>
            <Form className="grid md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                <Input title={t('first_name')} instance={name} />
                <Input title={t('last_name')} instance={lastName} />
                <Input className='col-span-full' title={t('username')} instance={username} />
                <Input title={t('phone')} instance={phone} />
                <Input title={t('country')} instance={country} />
                <Input className='col-span-full' title={t('email')} instance={email} />
                <Button
                    type='submit'
                    style='fill'
                    color='accent-orange'
                    height={10}
                    width='fit'
                    px={5}
                    disabled={Object.entries(formData).filter(([key, value]) => value !== data[key]).length === 0}
                >
                    {updateProfileMutation.isLoading ? <Spinner /> : t('update')}
                </Button>
            </Form>
        </div>
    )
}

export const DeleteProfile = () => {

    const { t } = useTranslation()
    const inputRef = useRef()
    const [agreed, setAgreed] = useState(false)
    const api = useAxios()
    const pwd = useInput('', { isEmpty: true })
    const { logoutUser } = useContext(AuthContext)

    const handleDelete = () => {
        const data = { current_password: pwd.value }
        api.delete('/api/v1/users/me/', data).then(res => {
            if (res.status === 204) {
                logoutUser()
            }
        }).catch(err => alertErr(err))
    }

    return (
        <div className='grid gap-3 w-full md:w-2/3 lg:w-1/2'>
            <BackButton />
            <h2 className='font-bold text-2xl'>{t('delete_profile')}</h2>
            <h1 className='text-accent-red font-bold text-2xl border-2 border-accent-red rounded-xl text-center p-5'>{t('delete_heading')}</h1>
            <Input title={t('password')} instance={pwd} type='password' must={true} />
            <div>
                <input onChange={(e) => setAgreed(e.target.checked)} ref={inputRef} type="checkbox" name="" id="check" />
                <label className='pl-2' for='check'>{t('delete_confirm')}</label>
            </div>
            <button onClick={handleDelete} className="button-outline-red" disabled={!agreed || !pwd.allValid || pwd.value.length === 0}>{t('delete')}</button>
        </div>
    )
}

const ProfileSettings = () => {

    const { t } = useTranslation()
    const outlet = useOutlet()

    if (outlet) return <Outlet />

    return (
        <div className='grid gap-3 w-full'>
            <BackToProfile />
            <Title text={t('profile_settings')} />
            <p className='font-bolditalic'>{t('select_option')}:</p>
            <NavLink to='password' className='flex items-center gap-2'><MdPassword />{t('change_pass')}</NavLink>
            <NavLink to='avatar' className='flex items-center gap-2'><BsPersonBoundingBox />{t('change_avatar')}</NavLink>
            <NavLink to='info' className='flex items-center gap-2'><BsPersonLinesFill />{t('change_profile_info')}</NavLink>
            <NavLink to='delete' className='flex items-center gap-2 text-accent-red font-bold'><BsFillPersonXFill />{t('delete_profile')}</NavLink>
        </div>
    )
}

export default ProfileSettings