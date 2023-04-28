import React, { useContext } from 'react'
import {
    useNavigate,
    NavLink,
    Outlet,
    useOutlet,
    useParams,
    useLocation,
    Navigate,
} from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { ProfileCard } from '../../components'
import { Spinner } from '../../components/ui'
import AuthContext from '../../contexts/AuthProvider'
import { BsBoxSeam } from 'react-icons/bs'
import { useProfile } from '../../api/api'
import { Helmet } from 'react-helmet-async'
import useScreen from '../../hooks/useScreen'
import { useTranslation } from 'react-i18next'

const Profile = () => {
    const { t } = useTranslation()
    const { isMinTablet } = useScreen()
    const { logoutUser } = useContext(AuthContext)
    const outlet = useOutlet()
    const { profileId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { data, isLoading, error } = useProfile(profileId)

    if (error) return error.message
    if (!outlet && ((profileId === 'me' && isMinTablet) || profileId !== 'me'))
        return <Navigate to="items" replace />

    return (
        <div className="grid items-center gap-5 md:grid-cols-[1fr_2fr] md:flex-row md:items-start lg:grid-cols-[1fr_3fr]">
            <Helmet>
                <title>{`${isLoading ? t('profile') : ''}${
                    data?.first_name || ''
                } ${data?.last_name || ''} - Grocket`}</title>
            </Helmet>
            {((profileId !== 'me' &&
                location.pathname === `/users/${profileId}/items`) ||
                !outlet ||
                isMinTablet) && (
                <div className="grid shrink-0 gap-5">
                    {isLoading && <Spinner type="profile" />}
                    {data && (
                        <ProfileCard
                            id={data?.id}
                            firstName={data?.first_name}
                            lastName={data?.last_name}
                            email={data?.email}
                            avatar={data?.avatar}
                            rating={data?.rating}
                            commentsCount={data?.comments_count}
                            phone={data?.phone}
                            withComments
                            country={data?.country}
                        />
                    )}
                    {!isMinTablet && profileId === 'me' && (
                        <NavLink
                            to="items"
                            className="ml-5 flex w-fit items-center gap-2 text-xl font-bold"
                        >
                            <BsBoxSeam />
                            {t('items')}
                        </NavLink>
                    )}
                    {profileId === 'me' && (
                        <button
                            onClick={logoutUser}
                            className="ml-5 flex w-fit items-center gap-2 font-bold text-accent-red transition-all duration-150 hover:gap-3"
                        >
                            {t('logout_from_acc')}
                            <FiLogOut />
                        </button>
                    )}
                </div>
            )}
            <Outlet />
        </div>
    )
}

export default Profile
