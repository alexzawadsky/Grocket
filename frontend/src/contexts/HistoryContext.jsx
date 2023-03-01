import { createContext, useContext } from "react";
import useLocalStorage from '../hooks/useLocalStorage'
import AuthContext from "./AuthProvider";

const SearchHistoryContext = createContext();

export default SearchHistoryContext

export const SearchHistoryProvider = ({ children }) => {

    const [lookHistory, setLookHistory] = useLocalStorage('lookHistory', [])

    const { user } = useContext(AuthContext)

    const updateHistory = (product) => {
        if (product.user.id === user?.user_id) return
        if (lookHistory.filter((el) => el.id === product.id).length > 0) return
        setLookHistory([product, ...lookHistory])
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