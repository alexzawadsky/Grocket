import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui'
import { useGetChatMutation } from '../../api/api'
import { useContext } from 'react'
import AuthContext from '../../contexts/AuthProvider'

const SendMessageLink = ({ product }) => {
    const { t } = useTranslation()
    const getChatMutation = useGetChatMutation()
    const { user } = useContext(AuthContext)

    return (
        <Button
            style="fill"
            width="full"
            color="accent-orange"
            height={10}
            px={5}
            className="!py-1"
            onClick={() => user && getChatMutation.mutate(product?.id)}
            to={user ? null : `/login?redirectFrom=${window.location.pathname}`}
        >
            {t('send_message')}
        </Button>
    )
}

export default SendMessageLink
