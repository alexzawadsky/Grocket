import { SearchBar } from '../../components'
import { Title } from '../../components/ui'
import ProductsList from './ProductsList'
import HistoryList from './HistoryList'
import { useTranslation } from 'react-i18next'
import useScreen from '../../hooks/useScreen'
import { Helmet } from 'react-helmet-async'

const Landing = () => {
    const { t } = useTranslation()
    const { isMinTablet } = useScreen()

    return (
        // < className='flex flex-col md:gap-5 items-center md:items-start'>
        <>
            <Helmet>
                <title>Grocket - Goods especially for you</title>
            </Helmet>
            <SearchBar />
            <div className="flex w-full flex-col-reverse md:grid md:grid-cols-[2fr_1fr] md:gap-7 md:pr-5 lg:grid-cols-[3fr_1fr]">
                <section aria-label="main section of index page">
                    {isMinTablet && (
                        <Title
                            className="pb-5 !text-2xl md:pb-0 md:pl-5 lg:!text-3xl"
                            text={
                                <>
                                    {t('goods_for_you')}
                                    <span className="relative ml-3 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:rounded-sm before:bg-accent-orange">
                                        <span className="relative text-white">
                                            {t('you')}
                                        </span>
                                    </span>
                                </>
                            }
                        />
                    )}
                    <ProductsList />
                </section>
                <HistoryList />
            </div>
        </>
    )
}

export default Landing
