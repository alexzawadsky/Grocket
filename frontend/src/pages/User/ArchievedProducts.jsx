import UserProductsList from './UserProductsList'
import BackToProfile from './BackToProfile'
import { useTranslation } from 'react-i18next'

const Archieved = () => {

    const { t } = useTranslation()

    return (
        <div className='grid gap-5 w-full'>
            <BackToProfile />
            <h1 className='font-bold text-3xl'>{t('archived_items')}</h1>
            <UserProductsList query={{ is_archived: 1 }} />
        </div>
    )
}

export default Archieved