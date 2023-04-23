import { createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useExchangeRates } from "../api/api";

const CurrencyContext = createContext()

export default CurrencyContext

export const CurrencyProvider = ({ children }) => {

    const [targetCurrency, setTargetCurrency] = useLocalStorage('targetCurrency', 'USD')
    const { data, isLoading } = useExchangeRates()

    const convertPrice = price => {
        if (!data) return parseInt(price)
        return parseInt(price * (data[targetCurrency] || 1))
    }

    const contextData = {
        targetCurrency,
        setTargetCurrency,
        convertPrice,
        isLoading
    }

    return (
        <CurrencyContext.Provider value={contextData}>
            {children}
        </CurrencyContext.Provider>
    )
}