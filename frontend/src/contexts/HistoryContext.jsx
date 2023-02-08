import { createContext } from "react";
import useLocalStorage from '../hooks/useLocalStorage'

const SearchHistoryContext = createContext();

export default SearchHistoryContext

export const SearchHistoryProvider = ({ children }) => {

    const [lookHistory, setLookHistory] = useLocalStorage('lookHistory', [])

    const updateHistory = (product) => {
        if (lookHistory.filter((el) => el.id === product.id).length > 0) return
        setLookHistory([...lookHistory, product])
    }

    const clearHistory = () => {
        setLookHistory([])
    }

    const contextData = {
        lookHistory,
        updateHistory,
        clearHistory
    };

    return (
        <SearchHistoryContext.Provider value={contextData}>
            {children}
        </SearchHistoryContext.Provider>
    );
}