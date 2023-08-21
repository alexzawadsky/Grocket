import { SearchBar, SEO } from '../../components'
import { lazy, Suspense } from 'react'
import SiteWelcomeText from './SiteWelcomeText'
const ProductsList = lazy(() => import('./ProductsList'))
const HistoryList = lazy(() => import('./HistoryList'))

const Landing = () => {
    return (
        <>
            <SEO
                title="Grocket - Goods especially for you"
                description="Grocket is an international online marketplace that specializes in secondhand items. It provides a platform for users to buy and sell a variety of used goods from all over the world, including clothing, electronics, furniture, and more."
                name="Grocket"
                type="webwite"
            />
            <SearchBar />
            <Suspense>
                <div className="flex w-full flex-col-reverse md:grid md:grid-cols-[2fr_1fr] md:gap-7 md:pr-5 lg:grid-cols-[3fr_1fr]">
                    <section aria-label="main section of index page">
                        <SiteWelcomeText />
                        <ProductsList />
                    </section>
                    <HistoryList />
                </div>
            </Suspense>
        </>
    )
}

export default Landing
