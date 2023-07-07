import { useContext } from 'react'
import getSymbolFromCurrency from 'currency-symbol-map'
import { useTranslation } from 'react-i18next'
import CurrencyContext from '../../contexts/CurrencyContext'
import cn from 'classnames'

const Price = ({ className, price, text }) => {
    const { convertPrice, targetCurrency, isLoading } =
        useContext(CurrencyContext)
    const { t } = useTranslation()
    const value =
        price == 0
            ? t('free')
            : `${
                  isLoading ? t('loading') : convertPrice(price)
              } ${getSymbolFromCurrency(targetCurrency)}`

    if (text) return value

    return (
        <p
            className={cn(className, 'flex items-center')}
            aria-label="item price"
        >
            {value}
        </p>
    )
}

export default Price
