import { useMediaQuery } from 'react-responsive'

const useScreen = () => {
    const maxPhoneW = 639
    const minTabletW = 768
    const maxTabletW = 1023
    const minPCW = 1024
    const minLargePCW = 1280

    const isMaxPhone = useMediaQuery({ query: `(max-width: ${maxPhoneW}px)` })
    const isMinTablet = useMediaQuery({ query: `(min-width: ${minTabletW}px)` })
    const isMaxTablet = useMediaQuery({ query: `(max-width: ${maxTabletW}px)` })
    const isMinPC = useMediaQuery({ query: `(min-width: ${minPCW}px)` })
    const isLargePC = useMediaQuery({ query: `(min-width: ${minLargePCW}px)` })

    return {
        maxPhoneW,
        minTabletW,
        maxTabletW,
        minPCW,
        minLargePCW,
        isMaxPhone,
        isMinTablet,
        isMaxTablet,
        isMinPC,
        isLargePC,
    }
}

export default useScreen
