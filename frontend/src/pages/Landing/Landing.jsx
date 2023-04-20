import { SearchBar } from '../../components'
import { Title } from '../../components/ui'
import ProductsList from './ProductsList'
import HistoryList from './HistoryList'
import { useTranslation } from 'react-i18next'
import useScreen from '../../hooks/useScreen'

const Landing = () => {

    const { t } = useTranslation()
    const { isMinTablet } = useScreen()

    return (
        // < className='flex flex-col md:gap-5 items-center md:items-start'>
        <>
            <SearchBar />
            <div className='md:grid md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] flex flex-col-reverse md:gap-7 w-full md:pr-5'>
                <section aria-label='main section of index page'>
                    {isMinTablet && <Title
                        className='md:pl-5 pb-5 md:pb-0 !text-2xl lg:!text-3xl'
                        text={
                            <>
                                {t('goods_for_you')}
                                <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-accent-orange relative inline-block ml-3 before:rounded-sm">
                                    <span className="relative text-white">{t('you')}</span>
                                </span>
                            </>}
                    />}
                    <ProductsList />
                </section>
                <HistoryList />
            </div>
        </>
    )
}

export default Landing