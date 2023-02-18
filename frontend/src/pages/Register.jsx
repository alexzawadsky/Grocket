import React, { useState, useRef, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { BsFillTrashFill } from 'react-icons/bs'
import AuthContext from '../contexts/AuthProvider'
import { toBase64 } from "../utils";
import { AvatarCrop, ProfileCard, Title } from '../components'
import { useMediaQuery } from 'react-responsive';

const Register = () => {

    const { registerUser } = useContext(AuthContext)

    const [name, setName] = useState()
    const [lastName, setLastName] = useState()
    const [email, setEmail] = useState()
    const [pwd, setPwd] = useState()
    const [rePwd, setRePwd] = useState()
    const [phone, setPhone] = useState()
    const [avatar, setAvatar] = useState(null)
    const [username, setUsername] = useState()
    const [country, setCountry] = useState()
    const [imageInInput, setImageInInput] = useState()
    const [adjSaved, setAjdSaved] = useState(false)

    const editorRef = useRef()
    const fileInputRef = useRef()

    const isPC = useMediaQuery({ query: '(min-width: 1024px)' })
    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        let avatar64
        if (imageInInput && !adjSaved && !avatar) {
            alert('Please adjust your avatar before submitting')
            return
        }
        if (avatar) {
            const dataUrl = editorRef.current.getImage().toDataURL()
            const result = await fetch(dataUrl)
            const blob = await result.blob()
            avatar64 = await toBase64(blob)
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
            re_password: rePwd,
            avatar: avatar64
        }
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
        <div className='grid gap-5'>
            <Title text='Create account' />
            <div className="flex flex-col md:flex-row max-w-full justify-between gap-5">
                {isPC ? <ProfileCard
                    firstName={name}
                    lastName={lastName}
                    email={email}
                    phone={phone}
                    rating={5.00}
                    avatar={avatar}
                    withComments={false}
                /> : null}
                <form onSubmit={handleSubmit} className='w-full lg:w-1/3 grid md:grid-cols-2 gap-2 md:shrink'>
                    <div>
                        <label htmlFor="name">First name:</label>
                        <input className='grocket-input w-full' onChange={e => setName(e.target.value)} type="text" />
                    </div>
                    <div>
                        <label htmlFor="lastname">Last name:</label>
                        <input className='grocket-input w-full' onChange={e => setLastName(e.target.value)} type="text" />
                    </div>
                    <div className='grid col-span-full'>
                        <label htmlFor="name">Username:</label>
                        <input className='grocket-input' onChange={e => setUsername(e.target.value)} type="text" />
                    </div>
                    <div>
                        <label htmlFor="name">Phone number:</label>
                        <input className='grocket-input w-full' onChange={e => setPhone(e.target.value)} type="text" />
                    </div>
                    <div>
                        <label htmlFor="lastname">Country:</label>
                        <input className='grocket-input w-full' onChange={e => setCountry(e.target.value)} type="text" />
                    </div>
                    <div className="grid col-span-full">
                        <label htmlFor="email">Email:</label>
                        <input className='grocket-input' onChange={e => setEmail(e.target.value)} type="text" />
                    </div>
                    <div>
                        <label htmlFor="">Password:</label>
                        <input className='grocket-input w-full' onChange={e => setPwd(e.target.value)} type="password" />
                    </div>
                    <div>
                        <label htmlFor="">Repeat pwd:</label>
                        <input className='grocket-input w-full' onChange={e => setRePwd(e.target.value)} type="password" />
                    </div>
                    <div className="flex items-center gap-3 justify-between col-span-full">
                        <input ref={fileInputRef} onChange={e => setImageInInput(e.target.files[0])} type="file" />
                        {imageInInput ? <button onClick={removePhoto} type='button' className='border-2 border-accent-red hover:bg-accent-red/[0.1] text-accent-red h-full px-2 font-bold rounded-full flex items-center gap-2'><BsFillTrashFill />delete</button> : null}
                    </div>
                    {!isTablet && !adjSaved ? <AvatarCrop
                        editorRef={editorRef}
                        image={imageInInput}
                        setState={setAjdSaved}
                        adjSaved={adjSaved}
                        onSave={handleAdjSave}
                    /> : adjSaved && !adjSaved ? <p className='text-green-600 font-bold'>Saved!</p> : null}
                    <button className='button-fill-orange col-span-full !w-full mt-3'><p>{!loading ? 'Register' : 'Loading...'}</p></button>
                </form>
                {isTablet ? <AvatarCrop
                    editorRef={editorRef}
                    image={imageInInput}
                    setState={setAjdSaved}
                    adjSaved={adjSaved}
                    onSave={handleAdjSave}
                /> : null}
            </div>
            <div className='flex gap-2'>
                <p>Already have the account?</p>
                <NavLink to='/login' className='underline text-accent-orange hover:text-blue-900'>Login</NavLink>
            </div>
        </div>)
}

export default Register