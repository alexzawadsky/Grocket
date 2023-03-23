import { Title, SearchBar } from '../../components'
import ProductsList from '../../components/ProductsList'
import HistoryList from './HistoryList'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

const Landing = () => {

    const { t } = useTranslation()

    return (
        <div className='flex flex-col gap-5 items-center md:items-start'>
            <Helmet>
                <title>Grocket</title>
            </Helmet>
            <SearchBar />
            <div className='md:grid md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] flex flex-col-reverse gap-3 md:gap-7 w-full pr-5'>
                <div className='grid gap-x-5 w-full h-fit'>
                    <div className='md:pl-5 pb-5 md:pb-0'>
                        <Title text={t('goods_for_you')} />
                    </div>
                    <ProductsList />
                </div>
                <HistoryList />
            </div>
        </div>
    )
}

export default Landing