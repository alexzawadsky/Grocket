import { ProductsList, Title } from '../../components'
import { AiFillHeart } from 'react-icons/ai'
import useScreen from '../../hooks/useScreen'
import BackToProfile from './BackToProfile'
import { useTranslation } from 'react-i18next'

const MyFavourites = () => {

    const { t } = useTranslation()
    const { isMaxPhone } = useScreen()

    return (
        <div className='grid gap-5 w-full'>
            <BackToProfile />
            <div className='flex items-center gap-2'><p className='text-accent-red text-3xl'><AiFillHeart /></p><Title text={t('favourites')} /></div>
            <ProductsList query={{ is_favourited: true }} />
        </div>
    )
}

export default MyFavourites