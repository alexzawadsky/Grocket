import { useContext } from "react"
import getSymbolFromCurrency from 'currency-symbol-map'
import { useTranslation } from "react-i18next"
import CurrencyContext from "../../contexts/CurrencyContext"
import cn from 'classnames'

const Price = ({ className, price }) => {

    const { convertPrice, targetCurrency, isLoading } = useContext(CurrencyContext)
    const { t } = useTranslation()

    return <p className={cn(
        className,
        'flex items-center'
    )} aria-label='item price'>
        {price == 0 ? t('free') :
            `${isLoading ?
                t('loading') : convertPrice(price)} ${getSymbolFromCurrency(targetCurrency)}`}
    </p>
}

export default Price