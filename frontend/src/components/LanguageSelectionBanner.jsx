import useLocalStorage from "../hooks/useLocalStorage"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import localization from '../assets/localization.json'

const LanguageSelectionBanner = () => {

    const [languageSelected, setLanguageSelected] = useLocalStorage('languageSelected', false)
    const [text, setText] = useState(null)
    const [code, setCode] = useState(null)
    const { i18n } = useTranslation()

    useEffect(() => {
        if (languageSelected) return
        if ("geolocation" in navigator) {
            const userLanguage = i18n.resolvedLanguage
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                const locationUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${userLanguage}`;
                fetch(locationUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data?.countryCode in localization) {
                            setText(`Do you speak ${localization[data?.countryCode].name}?`)
                            setCode(data?.countryCode.toLowerCase())
                        } else {
                            setLanguageSelected(true)
                        }
                    })
                    .catch(error => console.error(error));
            });
        } else {
            console.log("Geolocation is not available on this device.");
        }
    }, [])

    if (!text) return

    return (!languageSelected && i18n.resolvedLanguage !== code) ?
        <div className="mb-4 flex gap-3 md:gap-6 items-center flex-wrap border-2 rounded-2xl p-3 w-full md:w-fit">
            <p className="font-bold ">{text}</p>
            {code &&
                <div className="flex gap-2 ml-auto">
                    <button
                        className="bg-accent-orange text-white font-bold px-2 py-1 rounded-lg"
                        onClick={() => {
                            i18n.changeLanguage(code)
                            setLanguageSelected(true)
                        }
                        }
                    >
                        Switch
                    </button>
                    <button
                        className="hover:text-accent-orange"
                        onClick={() => setLanguageSelected(true)}
                    >
                        Cancel
                    </button>
                </div>
            }
        </div> : null
}


export default LanguageSelectionBanner