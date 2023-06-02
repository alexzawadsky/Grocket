import { Route, useParams, useLocation, Routes } from 'react-router-dom'
import { ProfileCard, SEO } from '../../components'
import { Spinner } from '../../components/ui'
import { useProfile } from '../../api/api'
import useScreen from '../../hooks/useScreen'
import { useTranslation } from 'react-i18next'
import ProfileSettings from './ProfileSettings'
import UserComments from './Comments/Comments'
import AddComment from './Comments/AddComment'
import UserProductsList from './UserProductsList'
import NoResponse from '../../components/Placeholders/NoResponse'

const Profile = () => {
    const { t } = useTranslation()
    const { isMinTablet } = useScreen()
    const { profileId } = useParams()
    const location = useLocation()
    const { data, isLoading, error } = useProfile(profileId)

    if (error?.response?.status.toString()[0] === '5') return <NoResponse />
    if (error) return error.message

    return (
        <div className="grid items-center gap-5 md:grid-cols-[1fr_2fr] md:flex-row md:items-start lg:grid-cols-[1fr_3fr]">
            <SEO
                title={`${isLoading ? t('profile') : ''}${
                    data?.first_name || ''
                } ${data?.last_name || ''} - Grocket`}
                type="website"
                image={data?.avatar}
            />
            {(location.pathname === `/users/${profileId}` || isMinTablet) && (
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
                    {/* {!isMinTablet && profileId === 'me' && (
                        <NavLink
                            to="items"
                            className="ml-5 flex w-fit items-center gap-2 text-xl font-bold"
                        >
                            <BsBoxSeam />
                            {t('items')}
                        </NavLink>
                    )} */}
                    {/* {profileId === 'me' && (
                        <button
                            onClick={logoutUser}
                            className="ml-5 flex w-fit items-center gap-2 font-bold text-accent-red transition-all duration-150 hover:gap-3"
                        >
                            {t('logout_from_acc')}
                            <FiLogOut />
                        </button>
                    )} */}
                </div>
            )}
            <Routes>
                <Route path="" element={<UserProductsList />} />
                <Route path="comments" element={<UserComments />}>
                    <Route path="add" element={<AddComment />} />
                </Route>
                <Route path="settings/*" element={<ProfileSettings />} />
            </Routes>
        </div>
    )
}

export default Profile
