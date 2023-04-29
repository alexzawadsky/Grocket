import useInput from '../../hooks/useInput'
import { Input, Button, Flag } from '../../components/ui'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import cn from 'classnames'
import { useContext, useState } from 'react'
import CurrencyContext from '../../contexts/CurrencyContext'
import getSymbolFromCurrency from 'currency-symbol-map'

const Filters = ({ mnP, mxP, productsCountries, open, setOpen }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const minPrice = useInput(searchParams.get('min_price') || '', {
        isInt: true,
    })
    const maxPrice = useInput(searchParams.get('max_price') || '', {
        isInt: true,
    })
    const { convertPrice, targetCurrency } = useContext(CurrencyContext)
    const [countries, setCountries] = useState(
        searchParams.get('country') || []
    )
    const [countriesListOpen, setCountriesListOpen] = useState(false)
    const { t } = useTranslation()

    const handleApply = () => {
        minPrice.value && minPrice.allValid
            ? searchParams.set('min_price', minPrice.value)
            : searchParams.delete('min_price')
        maxPrice.value && maxPrice.allValid
            ? searchParams.set('max_price', maxPrice.value)
            : searchParams.delete('max_price')
        countries.length
            ? searchParams.set('country', countries.join(','))
            : searchParams.delete('country')
        setSearchParams(searchParams)
    }

    const toggleCountry = (code) => {
        countries.includes(code)
            ? setCountries((prevC) => prevC.filter((el) => el !== code))
            : setCountries((prevC) => [...prevC, code])
    }

    return (
        <aside
            className={cn(
                open ? 'right-0 max-md:pl-0' : '-right-[110%] max-md:pl-5',
                'top-0 z-40 h-fit w-80 transition-[right] duration-200 max-lg:absolute max-md:w-full md:w-fit lg:sticky lg:top-20 lg:w-full'
            )}
        >
            <div className="grid h-fit w-full gap-1 bg-white pb-5 dark:bg-zinc-800 md:w-80 md:rounded-lg md:border md:p-5 dark:md:border-2 dark:md:border-zinc-600 lg:w-full lg:rounded-lg lg:border-none lg:p-0">
                <p className="text-lg font-bold">{t('price')}</p>
                <div className="flex items-center gap-1">
                    <Input
                        instance={minPrice}
                        placeholder={`${t('from_price')}  ${
                            convertPrice(mnP) || 0
                        } ${getSymbolFromCurrency(targetCurrency)}`}
                    />
                    <Input
                        instance={maxPrice}
                        placeholder={`${t('to_price')}  ${
                            convertPrice(mxP) || 0
                        } ${getSymbolFromCurrency(targetCurrency)}`}
                    />
                </div>
                <p className="text-lg font-bold">{t('country')}</p>
                <ul className="flex flex-wrap gap-2">
                    {productsCountries &&
                        productsCountries
                            .slice(
                                0,
                                productsCountries.length > 30
                                    ? countriesListOpen
                                        ? productsCountries.length
                                        : 30
                                    : productsCountries.length
                            )
                            .map((el, key) => (
                                <li key={key}>
                                    <Button
                                        key={key}
                                        px={2}
                                        className={cn(
                                            countries.includes(el) &&
                                                '!border-accent-orange',
                                            'py-1 hover:border-accent-orange/[.5] dark:border-zinc-600 dark:hover:border-accent-orange/[.5]'
                                        )}
                                        onClick={() => toggleCountry(el)}
                                    >
                                        <Flag country={el} width="35px" />
                                    </Button>
                                </li>
                            ))}
                    {productsCountries && productsCountries.length > 30 && (
                        <Button
                            onClick={() =>
                                setCountriesListOpen((prevState) => !prevState)
                            }
                            px={2}
                            border={false}
                        >
                            {countriesListOpen
                                ? t('show_less')
                                : t('show_more')}
                        </Button>
                    )}
                </ul>
                <Button
                    className="mt-4"
                    height={10}
                    px={5}
                    style="fill"
                    width="fit"
                    color="accent-orange"
                    onClick={() => {
                        handleApply()
                        setOpen && setOpen(false)
                    }}
                >
                    {t('apply')}
                </Button>
            </div>
        </aside>
    )
}

export default Filters
