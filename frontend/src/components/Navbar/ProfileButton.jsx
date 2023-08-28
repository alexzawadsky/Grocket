import { NavLink } from 'react-router-dom'
import { Avatar } from '../ui'
import { useProfile } from '../../api/api'
import useScreen from '../../hooks/useScreen'
import cn from 'classnames'

const ProfileButton = () => {
    const { data, isLoading } = useProfile('me')
    const { isMinPC } = useScreen()

    return (
        <NavLink
            className="group/avatar flex h-10 items-center gap-2 font-bold max-md:mr-4"
            to="/users/me"
        >
            {!isLoading ? (
                <>
                    <Avatar
                        className={cn(
                            'group-hover/avatar:drop-shadow-md',
                            isLoading && 'animate-pulse opacity-30 duration-75'
                        )}
                        avatar={data?.avatar}
                        alt={`${data?.first_name} ${data?.last_name} avatar`}
                        width={40}
                        height={40}
                    />
                    {isMinPC && data?.first_name}
                </>
            ) : (
                <>
                    <p className="h-10 w-10 animate-pulse rounded-full bg-slate-100 duration-75 dark:bg-zinc-700"></p>
                    {isMinPC && (
                        <p
                            aria-hidden="true"
                            className="h-6 w-20 animate-pulse bg-slate-100 duration-75 dark:bg-zinc-700"
                        ></p>
                    )}
                </>
            )}
        </NavLink>
    )
}

export default ProfileButton
