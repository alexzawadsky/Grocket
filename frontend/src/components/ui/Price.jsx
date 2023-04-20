import { useMemo, useState } from "react"
import getSymbolFromCurrency from 'currency-symbol-map'
import { useTranslation } from "react-i18next"

const convertToCurrency = (value, targetCurrency) => {
    if (parseFloat(value) % 1 === 0) return parseInt(value)
    return value
}

const Price = ({ className, price, currency }) => {

    const targetCurrency = currency
    const { t } = useTranslation()
    const [value, setValue] = useState(useMemo(() =>
        convertToCurrency(price, targetCurrency),
        [price, targetCurrency]
    ))

    return (
        <p className={className} aria-label='item price'>
            {price == 0 ? t('free') : `${value} ${getSymbolFromCurrency(targetCurrency)}`}
        </p>
    )
}

export default Price