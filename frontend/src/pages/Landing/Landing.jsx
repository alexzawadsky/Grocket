import { Title, SearchBar } from '../../components'
import ProductsList from '../../components/ProductsList'
import HistoryList from './HistoryList'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import useScreen from '../../hooks/useScreen'

const Landing = () => {

    const { t } = useTranslation()
    const { isMinTablet } = useScreen()

    return (
        <div className='flex flex-col md:gap-5 items-center md:items-start'>
            <Helmet>
                <title>Grocket</title>
            </Helmet>
            <SearchBar />
            <div className='mt-0 md:grid md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] flex flex-col-reverse md:gap-7 w-full md:pr-5'>
                <div className='grid gap-x-5 w-full h-fit'>
                    {isMinTablet && <div className='md:pl-5 pb-5 md:pb-0'>
                        <Title text={t('goods_for_you')} />
                    </div>}
                    <ProductsList />
                </div>
                <HistoryList />
            </div>
        </div>
    )
}

export default Landing