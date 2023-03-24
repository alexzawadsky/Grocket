import { createContext, useState } from "react";

const CategoriesListStateContext = createContext();

export default CategoriesListStateContext

export const CategoriesListStateProvider = ({ children }) => {

    const [open, setOpen] = useState(false)

    const contextData = {
        open,
        setOpen
    };

    return (
        <CategoriesListStateContext.Provider value={contextData}>
            {children}
        </CategoriesListStateContext.Provider>
    );
}