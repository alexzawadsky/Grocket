import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useOutlet, useNavigate } from 'react-router-dom'
import { AvatarCrop, Input, Title } from '../components'
import { MdPassword } from 'react-icons/md'
import { BsPersonBoundingBox, BsPersonLinesFill, BsArrowLeft, BsFillPersonXFill } from 'react-icons/bs'
import useAxios from '../hooks/useAxios'
import { alertErr, info, notification, toBase64 } from '../utils'
import useInput from '../hooks/useInput'
import AuthContext from '../contexts/AuthProvider'
import { useMediaQuery } from 'react-responsive'


const BackButton = () => {
    return (
        <NavLink className='hover:text-accent-orange flex gap-2 items-center' to='/profile/settings'><BsArrowLeft />Back to settings</NavLink>
    )
}

export const PasswordReset = () => {

    const oldPwd = useInput('', { isEmpty: true })
    const newPwd = useInput('', { isEmpty: true })
    const repeatNewPwd = useInput('', { isEmpty: true })
    const axios = useAxios()

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            new_password: newPwd.value,
            re_new_password: repeatNewPwd.value,
            current_password: oldPwd.value
        }
        axios.post('/api/v1/users/set_password/', data).then(res => {
            if (res.status === 204) {
                notification('Your password has been updated')
            }
        }).catch(err => alertErr(err))
    }

    return (
        <form onSubmit={handleSubmit} className='grid gap-3 w-full md:w-2/3 lg:w-1/2'>
            <BackButton />
            <h2 className='font-bold text-2xl'>Change password</h2>
            <Input title='Old password' type='password' instance={oldPwd} must={true} />
            <Input title='New password' type='password' instance={newPwd} must={true} />
            <Input title='Repeat new password' type='password' instance={repeatNewPwd} must={true} />
            <button className='button-fill-orange' disabled={!oldPwd.allValid || !newPwd.allValid || !repeatNewPwd.allValid}>Change password</button>
        </form>
    )
}

export const ChangeAvatar = () => {

    const [imageInInput, setImageInInput] = useState(null)
    const [saved, setSaved] = useState(false)
    const editorRef = useRef()
    const api = useAxios()

    const handleAdjSave = async () => {
        let avatar
        if (editorRef) {
            const dataUrl = editorRef.current.getImage().toDataURL()
            const result = await fetch(dataUrl)
            const blob = await result.blob()
            avatar = await toBase64(blob)
        }
        api.patch('/api/v1/users/me/', { avatar }).then(res => notification('Your avatar has been updated')).catch(err => alertErr(err))
    }

    return (
        <div className='grid gap-3'>
            <BackButton />
            <h2 className='text-2xl font-bold'>Choose new avatar to upload, then click <i>Save adjustments</i></h2>
            <input type="file" onChange={(e) => setImageInInput(e.target.files[0])} />
            <div className="w-fit">
                <AvatarCrop
                    editorRef={editorRef}
                    image={imageInInput}
                    setState={setSaved}
                    adjSaved={saved}
                    onSave={handleAdjSave}
                />
            </div>
        </div>
    )
}

export const UpdateProfile = () => {

    const name = useInput('', { isEmpty: true })
    const lastName = useInput('', { isEmpty: true })
    const username = useInput('', { isEmpty: true })
    const email = useInput('', { isEmpty: true })
    const phone = useInput('', { isEmpty: true })
    const country = useInput('', { isEmpty: true })
    const [user, setUser] = useState(null)
    const api = useAxios()

    const formData = {
        first_name: name.value,
        last_name: lastName.value,
        username: username.value,
        email: email.value,
        phone: phone.value,
        country: country.value
    }

    useEffect(() => {
        api.get('/api/v1/users/me').then(res => {
            setUser(res.data)
            name.setValue(res.data.first_name)
            lastName.setValue(res.data.last_name)
            username.setValue(res.data.username)
            email.setValue(res.data.email)
            phone.setValue(res.data.phone)
            country.setValue(res.data.country)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        const changedFields = Object.entries(formData).filter(([key, value]) => value !== user[key])
        const data = Object.fromEntries(changedFields)
        if (Object.keys(data).length === 0) {
            info('No changes found')
            return
        }
        api.patch('/api/v1/users/me/', data)
            .then(res => {
                notification('Your profile has been updated')
                setUser(res.data)
            }).catch(err => alertErr(err))
    }

    return (
        <div className='grid gap-3 w-full md:w-2/3 lg:w-1/2'>
            <BackButton />
            <h2 className="text-2xl font-bold">Update profile info</h2>
            <form className="grid md:grid-cols-2 gap-3" onSubmit={handleSubmit}>
                <Input title='First name' instance={name} />
                <Input title='Last name' instance={lastName} />
                <div className="col-span-full">
                    <Input title='Username' instance={username} />
                </div>
                <Input title='Phone' instance={phone} />
                <Input title='Country' instance={country} />
                <div className="col-span-full">
                    <Input title='Email' instance={email} />
                </div>
                <button className="button-fill-orange">Update</button>
            </form>
        </div>
    )
}

export const DeleteProfile = () => {

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
            <h2 className='font-bold text-2xl'>Delete profile</h2>
            <h1 className='text-accent-red font-bold text-2xl border-2 border-accent-red rounded-xl text-center p-5'>THIS ACTION IS NOT REVERSIBLE, THINK TWICE BEFORE DOING IT!</h1>
            <Input title='Password' instance={pwd} type='password' must={true} />
            <div>
                <input onChange={(e) => setAgreed(e.target.checked)} ref={inputRef} type="checkbox" name="" id="check" />
                <label className='pl-2' for='check'>I understand the consequences, delete my account</label>
            </div>
            <button onClick={handleDelete} className="button-outline-red" disabled={!agreed || !pwd.allValid || pwd.value.length === 0}>DELETE</button>
        </div>
    )
}

const ProfileSettings = () => {

    const outlet = useOutlet()
    const isPhone = useMediaQuery({ query: '(max-width: 639px)' })

    return (
        <div className='grid gap-3 w-full'>
            {outlet ?
                <Outlet />
                :
                <>
                    {isPhone ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
                    <Title text='Profile settings' />
                    <p className='font-bolditalic'>Select option:</p>
                    <NavLink to='password' className='flex items-center gap-2'><MdPassword />Change password</NavLink>
                    <NavLink to='avatar' className='flex items-center gap-2'><BsPersonBoundingBox />Change avatar</NavLink>
                    <NavLink to='info' className='flex items-center gap-2'><BsPersonLinesFill />Change profile info</NavLink>
                    <NavLink to='delete' className='flex items-center gap-2 text-accent-red font-bold'><BsFillPersonXFill />Delete profile</NavLink>
                </>}
        </div>
    )
}

export default ProfileSettings