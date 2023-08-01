import defaultAvatar from '../../assets/images/default-avatar.png'
import cn from 'classnames'

const Avatar = ({ avatar, height, width, alt, className }) => {
    return (
        <img
            className={cn(
                'aspect-square rounded-full object-cover',
                !width && 'w-full',
                !avatar && 'dark:brightness-75 dark:invert',
                className
            )}
            src={avatar ? new URL(avatar).pathname : defaultAvatar}
            alt={alt}
            width={width && `${width}px`}
            height={height && `${height}px`}
        />
    )
}

export default Avatar
