import { useTranslation } from 'react-i18next'
import { Button } from '../ui'
import { useGetChatMutation } from '../../api/api'
import { useContext } from 'react'
import AuthContext from '../../contexts/AuthProvider'
import { Link } from 'react-router-dom'
import cn from 'classnames'

const SendMessageLink = ({ product, children, link }) => {
    const { t } = useTranslation()
    const getChatMutation = useGetChatMutation()
    const { user } = useContext(AuthContext)

    return (
        <Link
            className={cn(
                link
                    ? 'flex w-fit items-center gap-2 !font-primary text-accent-orange'
                    : 'flex h-10 w-full items-center justify-center rounded-lg bg-accent-orange !py-1 px-5 font-bold text-white',
                'text-accent-orange'
            )}
            onClick={() => user && getChatMutation.mutate(product?.id)}
            to={
                user
                    ? window.location.href
                    : `/login?redirectFrom=${window.location.pathname}`
            }
        >
            {children}
        </Link>
    )
}

export default SendMessageLink
