import React, { useContext } from 'react'
import { NavLink, Outlet, useOutlet, useParams } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { ProfileCard, Spinner } from '../../components'
import AuthContext from '../../contexts/AuthProvider'
import { useMediaQuery } from 'react-responsive'
import { AiFillHeart, AiOutlineSetting } from 'react-icons/ai'
import { BsCartCheck, BsCartDash, BsCart } from 'react-icons/bs'
import { useProfile } from '../../api/api'
import { Helmet } from 'react-helmet-async'
import useScreen from '../../hooks/useScreen'
import { useTranslation } from 'react-i18next'
// import Flag from 'react-flags'

const Profile = () => {

    const { t } = useTranslation()
    const { isMinTablet } = useScreen()
    const { logoutUser } = useContext(AuthContext)
    const outlet = useOutlet()
    const { profileId } = useParams()

    const { data, isLoading, error } = useProfile(profileId)

    const nav = [
        {
            title: <><BsCart />{t('active_items')}</>,
            me: false,
            link: 'lots'
        },
        {
            title: <><BsCartDash />{t('archived_items')}</>,
            me: true,
            link: 'archive'
        },
        {
            title: <><BsCartCheck />{t('sold_items')}</>,
            me: false,
            link: 'sold'
        },
        {
            title: <><AiFillHeart color={'red'} />{t('favourites')}</>,
            me: true,
            link: 'favourites'
        },
        {
            title: <><AiOutlineSetting />{t('settings')}</>,
            me: true,
            link: 'settings'
        },
    ]

    if (isLoading) return <Spinner />
    if (error) return error.message

    return (
        <div className='grid md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] items-center md:items-start md:flex-row gap-5'>
            <Helmet>
                <title>{data.first_name} {data.last_name} ({t('me')}) - Grocket</title>
            </Helmet>
            {outlet && !isMinTablet ?
                null
                :
                (
                    <div className='shrink-0 grid gap-5'>
                        <ProfileCard
                            id={data.id}
                            firstName={data.first_name}
                            lastName={data.last_name}
                            email={data.email}
                            avatar={data.avatar}
                            rating={5.00}
                            phone={data.phone}
                            withComments
                        />
                        {nav.map((n, key) =>
                            !n.me || profileId === 'me' ?
                                <NavLink
                                    key={key}
                                    to={n.link}
                                    className='font-bold text-xl flex items-center gap-2 w-fit'
                                >
                                    {n.title}
                                </NavLink> : null
                        )}
                        {profileId === 'me' && <button onClick={logoutUser} className='text-accent-red font-bold flex items-center gap-2 hover:gap-3 transition-all duration-150 w-fit'>{t('logout_from_acc')}<FiLogOut /></button>}
                    </div>
                )
            }
            <Outlet />
        </div>
    )
}

export default Profile