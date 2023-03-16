import UserProductsList from './UserProductsList'
import BackToProfile from './BackToProfile'
import { useTranslation } from 'react-i18next'

const MyLots = () => {

    const { t } = useTranslation()

    return (
        <div className='grid gap-5 w-full'>
            <BackToProfile />
            <h1 className='font-bold text-3xl'>{t('active_items')}</h1>
            <UserProductsList />
        </div>
    )
}

export default MyLots