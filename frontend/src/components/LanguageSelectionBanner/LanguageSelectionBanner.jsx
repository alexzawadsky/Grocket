import useLocalStorage from '../../hooks/useLocalStorage'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import localization from '../../assets/json/localization.json'
import Flag from '../ui/Flag'
import useScreen from '../../hooks/useScreen'
import { BsCheck } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { Button } from '../ui'

const LanguageSelectionBanner = () => {
    const [languageSelected, setLanguageSelected] = useLocalStorage(
        'languageSelected',
        false
    )
    const [resolvedLanguage, setResolvedLanguage] = useState(null)
    const [code, setCode] = useState(null)
    const { i18n } = useTranslation()
    const { isMinTablet } = useScreen()

    useEffect(() => {
        if (languageSelected) return
        if ('geolocation' in navigator) {
            const userLanguage = i18n.resolvedLanguage
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords
                const locationUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${userLanguage}`
                fetch(locationUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data?.countryCode in localization) {
                            setResolvedLanguage(
                                localization[data?.countryCode]?.name
                            )
                            setCode(data?.countryCode.toLowerCase())
                        } else {
                            setLanguageSelected(true)
                        }
                    })
                    .catch((error) => console.error(error))
            })
        } else {
            console.log('Geolocation is not available on this device.')
        }
    }, [])

    if (!resolvedLanguage) return
    return !languageSelected && i18n.resolvedLanguage !== code ? (
        <div className="fixed bottom-2 z-50 flex h-[51px] w-fit flex-wrap items-center gap-3 rounded-2xl border-2 bg-white px-3 dark:border-zinc-600 dark:bg-zinc-800 max-md:left-2 md:right-[68px] md:gap-6">
            <div className="my-1 flex items-center gap-1">
                Do you speak
                <div className="ml-1 w-5">
                    <Flag country={localization[code.toUpperCase()].flag} />
                </div>
                {isMinTablet && (
                    <span className="font-bold">{resolvedLanguage}</span>
                )}
                ?
            </div>
            {code && (
                <div className="ml-auto flex gap-2">
                    <Button
                        className="rounded-lg py-1 "
                        onClick={() => {
                            i18n.changeLanguage(code)
                            setLanguageSelected(true)
                        }}
                        px={2}
                        style="fill"
                        color="accent-orange"
                        border={false}
                    >
                        {isMinTablet ? 'Switch' : <BsCheck />}
                    </Button>
                    <button
                        className="hover:text-accent-orange"
                        onClick={() => setLanguageSelected(true)}
                    >
                        {isMinTablet ? 'Cancel' : <IoClose />}
                    </button>
                </div>
            )}
        </div>
    ) : null
}

export default LanguageSelectionBanner
