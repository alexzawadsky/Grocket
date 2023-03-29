import { useMemo, useState } from "react"
import getSymbolFromCurrency from 'currency-symbol-map'

const convertToCurrency = (value, targetCurrency) => {
    if (parseFloat(value) % 1 === 0) return parseInt(value)
    return value
}

const Price = ({ price, currency }) => {

    const targetCurrency = currency
    const [value, setValue] = useState(useMemo(() =>
        convertToCurrency(price, targetCurrency),
        [price, targetCurrency]
    ))

    return (
        <>
            {value} {getSymbolFromCurrency(targetCurrency)}
        </>
    )
}

export default Price