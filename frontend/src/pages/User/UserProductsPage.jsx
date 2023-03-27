import UserProductsList from './UserProductsList'
import BackToProfile from './BackToProfile'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Title } from '../../components'
import useScreen from '../../hooks/useScreen'

const UserProductsPage = () => {

    const { t } = useTranslation()
    const { profileId } = useParams()
    const { isMinTablet } = useScreen()

    return (
        <div className='grid gap-5 md:gap-3 w-full'>
            {!isMinTablet && <BackToProfile />}
            {/* <div className='ml-5'>
                <Title text={profileId === 'me' ? t('items') : t('sellers_items')} />
            </div> */}
            <UserProductsList />
        </div>
    )
}

export default UserProductsPage