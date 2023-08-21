import { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import AuthContext from '../../contexts/AuthProvider'
import { Avatar, RatingStars, Button, Flag } from '../../components/ui'
import { useTranslation } from 'react-i18next'
import SendMessageLink from './SendMessageLink'

const SellerCard = ({ profile, product }) => {
    const { t, i18n } = useTranslation()
    const { user } = useContext(AuthContext)
    const { productId } = useParams()
    const date = new Date(profile.date_joined).toLocaleDateString(
        i18n.resolvedLanguage,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }
    )

    return (
        <div className="grid w-full gap-3 rounded-xl border p-5 shadow-md dark:border-2 dark:border-zinc-600">
            <div className="flex items-center gap-5">
                <Link
                    to={
                        user?.user_id !== profile.id
                            ? `/users/${profile.id}`
                            : '/users/me'
                    }
                    aria-label="user profile"
                >
                    <Avatar height={50} width={50} avatar={profile.avatar} />
                </Link>
                <div aria-label="user name and rating">
                    <Link
                        to={
                            user?.user_id !== profile.id
                                ? `/users/${profile.id}`
                                : '/users/me'
                        }
                        className="flex items-center gap-2 hover:text-accent-orange"
                    >
                        <Flag size="5" country={profile.country} />
                        <p>
                            {profile.last_name} {profile.first_name}{' '}
                            {user && user.user_id === profile.id
                                ? `(${t('me')})`
                                : null}
                        </p>
                    </Link>
                    <RatingStars rating={profile.rating} />
                </div>
            </div>
            <p
                className="text-sm text-primary-300 dark:text-zinc-400"
                aria-label="user grocket join date"
            >{`${t('on_grocket_since')} ${date}`}</p>
            {user?.user_id !== profile.id && !product?.is_sold && (
                <SendMessageLink product={product} />
            )}
        </div>
    )
}

export default SellerCard
