import defaultAvatar from '../assets/images/default-avatar.png'

const Avatar = ({ avatar }) => {
    return <img
        className='object-cover rounded-full w-full'
        src={avatar ? avatar : defaultAvatar}
        alt=""
    />
}

export default Avatar