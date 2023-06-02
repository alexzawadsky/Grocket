import { SearchBar, SEO } from '../../components'
import { Title } from '../../components/ui'
import ProductsList from './ProductsList'
import HistoryList from './HistoryList'
import { useTranslation } from 'react-i18next'
import useScreen from '../../hooks/useScreen'

const Landing = () => {
    const { t } = useTranslation()
    const { isMinTablet } = useScreen()

    return (
        <>
            <SEO
                title="Grocket - Goods especially for you"
                description="Grocket is an international online marketplace that specializes in secondhand items. It provides a platform for users to buy and sell a variety of used goods from all over the world, including clothing, electronics, furniture, and more."
                name="Grocket"
                type="webwite"
            />
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
