import { useMemo, useState } from "react"

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
            {value} {targetCurrency}
        </>
    )
}

export default Price