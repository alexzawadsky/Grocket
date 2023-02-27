import { Title } from '../../components'
import ProductsList from './ProductsList'
import Search from './Search'
import HistoryList from './HistoryList'

const Landing = () => {
    return (
        <div className='flex flex-col gap-5 items-center md:items-start'>
            <Search />
            <div className='md:grid md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] flex flex-col-reverse gap-3 md:gap-7 w-full'>
                <div className='grid gap-5 w-full h-fit'>
                    <Title text='Goods especially for you' />
                    <ProductsList />
                </div>
                <HistoryList />
            </div>
        </div>
    )
}

export default Landing