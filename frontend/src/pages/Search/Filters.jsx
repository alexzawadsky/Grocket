import useInput from '../../hooks/useInput'
import { Input, Button } from '../../components/ui'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import cn from 'classnames'

const Filters = ({ mnP, mxP, open }) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const minPrice = useInput(searchParams.get('min_price'), { isInt: true })
    const maxPrice = useInput(searchParams.get('max_price'), { isInt: true })
    const country = useInput(searchParams.get('country'))
    const { t } = useTranslation()

    const handleApply = () => {
        minPrice.value && minPrice.allValid ?
            searchParams.set('min_price', minPrice.value) : searchParams.delete('min_price')
        maxPrice.value && maxPrice.allValid ?
            searchParams.set('max_price', maxPrice.value) : searchParams.delete('max_price')
        country.value ? searchParams.set('country', country.value) : searchParams.delete('country')
        setSearchParams(searchParams)
    }

    return (
        <aside className={cn(
            open && '!right-0 max-md:!pl-0',
            'mt-5 max-lg:absolute z-40 -right-[110%] max-md:pl-5 transition-all duration-200 top-0 grid gap-1 pb-5 md:p-5 lg:p-0 md:w-80 lg:w-full md:border dark:md:border-2 dark:md:border-zinc-600 lg:border-none md:rounded-lg lg:rounded-lg h-fit w-full bg-white dark:bg-zinc-800'
        )}>
            <p className='font-bold text-lg'>{t('price')}</p>
            <div className="flex gap-1 items-center">
                <Input
                    instance={minPrice}
                    placeholder={`${t('from_price')}   ${mnP || 0}`}
                />
                <Input
                    instance={maxPrice}
                    placeholder={`${t('to_price')}   ${mxP || 0}`}
                />
            </div>
            <Input
                boldTitle
                titleSize='lg'
                containerClassName='mt-4'
                title={t('country')}
                instance={country}
            />
            <Button
                className='mt-4'
                height={10}
                px={5}
                style='fill'
                width='fit'
                color='accent-orange'
                onClick={handleApply}
            >
                {t('apply')}
            </Button>
        </aside>
    )
}

export default Filters