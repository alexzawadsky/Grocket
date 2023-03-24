import { ProductsList, Title } from '../../components'
import { AiFillHeart } from 'react-icons/ai'
import BackToProfile from './BackToProfile'
import { useTranslation } from 'react-i18next'

const MyFavourites = () => {

    const { t } = useTranslation()

    return (
        <div className='grid gap-5 md:gap-0 w-full'>
            <BackToProfile />
            <div className='flex items-center gap-2 md:pl-5'>
                <p className='text-accent-red text-3xl'><AiFillHeart /></p>
                <Title text={t('favourites')} />
            </div>
            <ProductsList query={{ is_favourited: true }} />
        </div>
    )
}

export default MyFavourites