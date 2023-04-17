import { NavLink } from "react-router-dom"
import { Avatar } from "../ui"
import { useProfile } from "../../api/api"
import useScreen from "../../hooks/useScreen"

const ProfileButton = () => {

    const { data, isLoading } = useProfile('me')
    const { isMinTablet } = useScreen()

    return <NavLink className='flex items-center gap-2 h-10 font-bold max-md:mr-4' to='/users/me'>
        {!isLoading ?
            <>
                <Avatar
                    className={isLoading && 'animate-pulse duration-75 opacity-30'}
                    avatar={data?.avatar}
                    alt={`${data?.name} avatar`}
                    width={40}
                    height={40}
                />
                {isMinTablet && data?.first_name}
            </>
            :
            <>
                <p className="bg-slate-100 dark:bg-zinc-700 animate-pulse duration-75 rounded-full w-10 h-10"></p>
                {isMinTablet && <p aria-hidden='true' className="bg-slate-100 dark:bg-zinc-700 animate-pulse duration-75 h-6 w-20"></p>}
            </>
        }
    </NavLink>
}

export default ProfileButton