import { Route, useParams, useLocation, Routes } from 'react-router-dom'
import { ProfileCard, SEO } from '../../components'
import { Spinner } from '../../components/ui'
import { useProfile } from '../../api/api'
import useScreen from '../../hooks/useScreen'
import { useTranslation } from 'react-i18next'
import { Suspense, lazy } from 'react'
const ProfileSettings = lazy(() => import('./ProfileSettings'))
const UserComments = lazy(() => import('./Comments/Comments'))
const AddComment = lazy(() => import('./Comments/AddComment'))
const UserProductsList = lazy(() => import('./UserProductsList'))
const NoResponse = lazy(() =>
    import('../../components/Placeholders/NoResponse')
)

const Profile = () => {
    const { t } = useTranslation()
    const { isMinTablet } = useScreen()
    const { profileId } = useParams()
    const location = useLocation()
    const { data, isLoading, error } = useProfile(profileId)

    if (error?.response?.status.toString()[0] === '5')
        return (
            <Suspense>
                <NoResponse />
            </Suspense>
        )
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
                </div>
            )}
            <Suspense>
                <Routes>
                    <Route path="" element={<UserProductsList />} />
                    <Route path="comments" element={<UserComments />}>
                        <Route path="add" element={<AddComment />} />
                    </Route>
                    <Route path="settings/*" element={<ProfileSettings />} />
                </Routes>
            </Suspense>
        </div>
    )
}

export default Profile
