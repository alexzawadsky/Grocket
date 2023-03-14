import { useMediaQuery } from "react-responsive"

const useScreen = () => {

    const isMaxPhone = useMediaQuery({ query: '(max-width: 639px)' })
    const isMinTablet = useMediaQuery({ query: '(min-width: 768px)' })
    const isMaxTablet = useMediaQuery({ query: '(max-width: 1023px)' })
    const isMinPC = useMediaQuery({ query: '(min-width: 1024px)' })
    const isLargePC = useMediaQuery({ query: '(min-width: 1280px)' })

    return {
        isMaxPhone,
        isMinTablet,
        isMaxTablet,
        isMinPC,
        isLargePC
    }
}

export default useScreen