import React, { useState, useRef, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { BsFillTrashFill } from 'react-icons/bs'
import AuthContext from '../contexts/AuthProvider'
import { toBase64 } from "../utils";
import AvatarCrop from '../components/AvatarCrop'
import ProfileCard from '../components/ProfileCard'

const Register = () => {

    const { registerUser } = useContext(AuthContext)

    const [name, setName] = useState()
    const [lastName, setLastName] = useState()
    const [email, setEmail] = useState()
    const [pwd, setPwd] = useState()
    const [phone, setPhone] = useState()
    const [avatar, setAvatar] = useState(null)
    const [username, setUsername] = useState()
    const [country, setCountry] = useState()
    const [imageInInput, setImageInInput] = useState()
    const [adjSaved, setAjdSaved] = useState(false)

    const editorRef = useRef()
    const fileInputRef = useRef()

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const dataUrl = editorRef.current.getImage().toDataURL()
        const result = await fetch(dataUrl)
        const blob = await result.blob()
        if (imageInInput && !adjSaved && !avatar) {
            alert('Please adjust your avatar before submitting')
            return
        }
        setLoading(true)
        const data = {
            first_name: name,
            last_name: lastName,
            phone: phone,
            email: email,
            username: username,
            country: country,
            password: pwd,
            avatar: await toBase64(blob)
        }
        console.log(data)
        registerUser(data)
        setLoading(false)
    }

    const handleAdjSave = async () => {
        if (editorRef) {
            const dataUrl = editorRef.current.getImage().toDataURL()
            const result = await fetch(dataUrl)
            const blob = await result.blob()
            setAvatar(window.URL.createObjectURL(blob))
        }
        setAjdSaved(true)
    }

    const removePhoto = () => {
        fileInputRef.current.value = null
        setImageInInput(false)
        setAvatar(null)
    }

    return (
        <div>
            <h1 className='font-bold text-3xl pb-5'>Create account</h1>
            <div className="flex w-full justify-between">
                <ProfileCard
                    firstName={name}
                    lastName={lastName}
                    email={email}
                    phone={phone}
                    rating={5.00}
                    avatar={avatar}
                    withComments={false}
                />
                <form onSubmit={handleSubmit} className='w-1/3 flex flex-col justify-around'>
                    <div className="flex w-full gap-5">
                        <div className='w-full'>
                            <label htmlFor="name">First name:</label>
                            <input className='grocket-input w-full' onChange={e => setName(e.target.value)} type="text" />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="lastname">Last name:</label>
                            <input className='grocket-input w-full' onChange={e => setLastName(e.target.value)} type="text" />
                        </div>
                    </div>
                    <label htmlFor="name">Username:</label>
                    <input className='grocket-input' onChange={e => setUsername(e.target.value)} type="text" />
                    <div className="flex w-full gap-5">
                        <div className='w-full'>
                            <label htmlFor="name">Phone number:</label>
                            <input className='grocket-input w-full' onChange={e => setPhone(e.target.value)} type="text" />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="lastname">Country:</label>
                            <input className='grocket-input w-full' onChange={e => setCountry(e.target.value)} type="text" />
                        </div>
                    </div>
                    <label htmlFor="email">Email:</label>
                    <input className='grocket-input' onChange={e => setEmail(e.target.value)} type="text" />
                    <label htmlFor="">Password:</label>
                    <input className='grocket-input' onChange={e => setPwd(e.target.value)} type="password" />
                    <div className="flex items-center gap-3 justify-between mt-3">
                        <input ref={fileInputRef} onChange={e => setImageInInput(e.target.files[0])} type="file" />
                        {imageInInput ? <button onClick={removePhoto} type='button' className='border-2 border-accent-red hover:bg-accent-red/[0.1] text-accent-red h-full px-2 font-bold rounded-full flex items-center gap-2'><BsFillTrashFill />delete</button> : null}
                    </div>
                    <button className='bg-accent-orange text-white font-bold py-3 rounded-xl mt-3'>{!loading ? 'Register' : 'Loading...'}</button>
                </form>
                <AvatarCrop
                    editorRef={editorRef}
                    image={imageInInput}
                    setState={setAjdSaved}
                    adjSaved={adjSaved}
                    onSave={handleAdjSave}
                />
            </div>
            <div className='flex gap-2'>
                <p>Already have the account?</p>
                <NavLink to='/login' className='underline text-accent-orange hover:text-blue-900'>Login</NavLink>
            </div>
        </div>)
}

export default Register