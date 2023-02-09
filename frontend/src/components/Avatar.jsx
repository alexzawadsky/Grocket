import React from 'react'

const getRandomColor = () => {
    var letters = '0123456789abcdef';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const Avatar = ({ avatar }) => {

    return <img className='object-cover rounded-full w-full h-full' src={avatar ? avatar : '/images/default-avatar.png'} alt="" />
}

export default Avatar