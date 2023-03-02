import React from 'react'

const Avatar = ({ avatar }) => {

    return <img className='object-cover rounded-full' src={avatar ? avatar : '/images/default-avatar.png'} alt="" />
}

export default Avatar