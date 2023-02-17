import React, { useContext, useRef, useState } from 'react'
import { NavLink, Outlet, useOutlet, useNavigate } from 'react-router-dom'
import { Input, Title } from '../components'
import { MdPassword } from 'react-icons/md'
import { BsPersonBoundingBox, BsPersonLinesFill, BsArrowLeft, BsFillPersonXFill } from 'react-icons/bs'
import useAxios from '../hooks/useAxios'
import { alertErr } from '../utils'
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
        axios.post('/api/v1/users/set_password', data).then(res => {
            if (res.status === 204) {
                alert('updated')
            }
        }).catch(err => alertErr(err))
    }

    return (
        <form onSubmit={handleSubmit} className='grid gap-3 w-full md:w-2/3 lg:w-1/2'>
            <BackButton />
            <Input title='Old password' type='password' instance={oldPwd} must={true} />
            <Input title='New password' type='password' instance={newPwd} must={true} />
            <Input title='Repeat new password' type='password' instance={repeatNewPwd} must={true} />
            <button className='button-fill-orange'>Update password</button>
        </form>
    )
}

export const ChangeAvatar = () => {
    return (
        <div>
            <BackButton />
            change avatar
        </div>
    )
}

export const UpdateProfile = () => {
    return (
        <div>
            <BackButton />
            update profile
        </div>
    )
}

export const DeleteProfile = () => {

    const inputRef = useRef()
    const [agreed, setAgreed] = useState(false)
    const api = useAxios()
    const pwd = useInput('', { isEmpty: true })
    const navigate = useNavigate()
    const { logoutUser } = useContext(AuthContext)

    const handleDelete = () => {
        api.delete('/api/v1/users/me', { current_password: pwd.value }).then(res => {
            if (res.status === 204) {
                logoutUser()
            }
        }).catch(err => alertErr(err))
    }

    return (
        <div className='grid gap-3 w-full md:w-2/3 lg:w-1/2'>
            <BackButton />
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