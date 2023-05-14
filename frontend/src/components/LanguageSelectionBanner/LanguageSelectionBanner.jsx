import useLocalStorage from '../../hooks/useLocalStorage'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import localizations from '../../assets/json/localization.json'
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
    const [localization, setLocalization] = useState(null)
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
                        const locale = Object.values(localizations).find(
                            (el) => el?.flag === data?.countryCode
                        )
                        if (locale) {
                            setLocalization(locale)
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

    if (!localization) return
    if (languageSelected) return
    if (i18n.resolvedLanguage === localization?.code) return
    return (
        <div className="fixed bottom-2 z-50 flex h-[51px] w-fit flex-wrap items-center gap-3 rounded-2xl border-2 bg-white px-3 dark:border-zinc-600 dark:bg-zinc-800 max-md:left-2 md:right-[68px] md:gap-6">
            <div className="my-1 flex items-center gap-1">
                Do you speak
                <Flag width={20} className="ml-1" country={localization.flag} />
                {isMinTablet && (
                    <span className="font-bold">{localization.name}</span>
                )}
                ?
            </div>
            <div className="ml-auto flex gap-2">
                <Button
                    className="rounded-lg py-1 "
                    onClick={() => {
                        i18n.changeLanguage(localization.code)
                        setLanguageSelected(true)
                    }}
                    px={2}
                    style="fill"
                    color="accent-orange"
                    border={false}
                >
                    {isMinTablet ? 'Yes' : <BsCheck />}
                </Button>
                <button
                    className="hover:text-accent-orange"
                    onClick={() => setLanguageSelected(true)}
                >
                    {isMinTablet ? 'No' : <IoClose />}
                </button>
            </div>
        </div>
    )
}

export default LanguageSelectionBanner
