import defaultAvatar from '../assets/images/default-avatar.png'
import cn from 'classnames'

const Avatar = ({ avatar, height, width, alt }) => {
    return <img
        className={cn('object-cover rounded-full', !width && 'w-full')}
        src={avatar ? avatar : defaultAvatar}
        alt={alt}
        width={width && `${width}px`}
        height={height && `${height}px`}
    />
}

export default Avatar