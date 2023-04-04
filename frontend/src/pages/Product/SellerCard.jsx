import { useContext } from "react"
import { NavLink } from "react-router-dom"
import AuthContext from "../../contexts/AuthProvider"
import { Avatar, RatingStars, Button } from "../../components/ui"
import { useTranslation } from "react-i18next"

const SellerCard = ({ profile }) => {

    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const date = new Date(profile.date_joined).toLocaleDateString(undefined,
        { year: 'numeric', month: 'short', day: 'numeric' }
    )

    return (
        <div className='border shadow-md p-5 rounded-xl grid gap-3 w-full'>
            <div className='flex items-center gap-5'>
                <Avatar height={50} width={50} avatar={profile.avatar} />
                <div>
                    <NavLink
                        to={user?.user_id !== profile.id ? `/users/${profile.id}` : '/users/me'}
                        className='hover:text-accent-orange'
                    >{profile.last_name} {profile.first_name} {user && user.user_id === profile.id ? `(${t('me')})` : null}</NavLink>
                    <RatingStars rating={profile.rate} />
                </div>
            </div>
            <p className='text-sm text-primary-300'>{`${t('on_grocket_since')} ${date}`}</p>
            {user?.user_id !== profile.id &&
                <Button
                    style='fill'
                    width='full'
                    color='accent-orange'
                    height={10}
                    px={5}
                >
                    <NavLink to={`/users/${profile.id}/chat`}>
                        Send message
                    </NavLink>
                </Button>
            }
        </div>
    )
}

export default SellerCard