import { createContext, useState, useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ThemeContext = createContext()

export default ThemeContext

export const ThemeProvider = ({ children }) => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const [isDark, setIsDark] = useState(mediaQuery.matches)
    const [themeSetting, setThemeSetting] = useLocalStorage(
        'themeSetting',
        'auto'
    )
    const html = document.querySelector('html')

    useEffect(() => {
        const handleChange = () => setIsDark(mediaQuery.matches)
        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [mediaQuery])

    useEffect(() => {
        if (themeSetting !== 'auto') {
            setIsDark(themeSetting === 'dark')
        } else {
            setIsDark(mediaQuery.matches)
        }
    }, [themeSetting])

    useEffect(() => {
        isDark ? html.classList.add('dark') : html.classList.remove('dark')
    }, [isDark])

    const contextData = {
        isDark,
        themeSetting,
        setThemeSetting,
        setIsDark,
    }

    return (
        <ThemeContext.Provider value={contextData}>
            {children}
        </ThemeContext.Provider>
    )
}
