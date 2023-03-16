import { useEffect, useState } from "react"

const Price = ({ price, currency }) => {

    const [value, setValue] = useState(price)
    const targetCurrency = currency

    useEffect(() => {
        if (parseFloat(value) % 1 === 0) setValue(parseInt(value))
    }, [])

    return (
        <>
            {value} {targetCurrency}
        </>
    )
}

export default Price