import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import AuthContext from './AuthProvider'

const SearchHistoryContext = createContext()

export default SearchHistoryContext

export const SearchHistoryProvider = ({ children }) => {
    const [lookHistory, setLookHistory] = useLocalStorage('lookHistory', [])
    const [searchHistory, setSearchHistory] = useLocalStorage(
        'searchHistory',
        []
    )
    const { user } = useContext(AuthContext)

    const updateHistory = (product) => {
        if (product.user.id === user?.user_id) return
        setLookHistory([
            product,
            ...lookHistory.filter((el) => el.id !== product.id),
        ])
    }

    const clearHistory = () => {
        setLookHistory([])
    }

    const getFilteredHistory = (filterStr) => {
        if (filterStr === '') return searchHistory.slice(0, 5)
        return searchHistory.filter((el) => el.includes(filterStr))
    }

    const contextData = {
        lookHistory,
        updateHistory,
        clearHistory,
        searchHistory,
        setSearchHistory,
        getFilteredHistory,
    }

    return (
        <SearchHistoryContext.Provider value={contextData}>
            {children}
        </SearchHistoryContext.Provider>
    )
}
