import React from 'react'

const getRandomColor = () => {
    var letters = '0123456789abcdef';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const Avatar = ({ avatar, firstName, lastName, small }) => {
    const color = getRandomColor()

    return (
        <>
            {avatar ? <img className='object-cover rounded-full w-full h-full' src={avatar} alt="" /> :
                (
                    <div style={{ backgroundColor: color }} className={`flex items-center justify-center w-full h-full border-2 rounded-full`}>
                        <p className={`${!small ? 'text-7xl' : ''} font-bold`}>{firstName[0]}</p>
                        <p className={`${!small ? 'text-7xl' : ''} font-bold`}>{lastName[0]}</p>
                    </div>
                )
            }
        </>
    )
}

export default Avatar