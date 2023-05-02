import { createContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useExchangeRates } from '../api/api'

const CurrencyContext = createContext()

export default CurrencyContext

export const CurrencyProvider = ({ children }) => {
    const [targetCurrency, setTargetCurrency] = useLocalStorage(
        'targetCurrency',
        'USD'
    )
    const { data, isLoading } = useExchangeRates()
    const exchangeRate = data ? data[targetCurrency] : 1

    const convertPrice = (price) => {
        if (!price) return 0
        let convertedPrice
        if (!data) {
            convertedPrice = price
        } else {
            convertedPrice = price * (data[targetCurrency] || 1)
        }
        return parseFloat(convertedPrice)
            .toFixed(convertedPrice - Math.floor(convertedPrice) !== 0 ? 2 : 0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }

    const contextData = {
        targetCurrency,
        setTargetCurrency,
        convertPrice,
        isLoading,
        exchangeRate,
    }

    return (
        <CurrencyContext.Provider value={contextData}>
            {children}
        </CurrencyContext.Provider>
    )
}
