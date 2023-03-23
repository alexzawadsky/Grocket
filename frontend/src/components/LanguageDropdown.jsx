import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import langs from '../assets/localization.json'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import useScreen from "../hooks/useScreen"

const LanguageDropdown = () => {

    const { i18n } = useTranslation()
    const [open, setOpen] = useState(false)
    const selectedLang = langs[i18n.resolvedLanguage.toUpperCase()]
    const { isMinTablet } = useScreen()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (open && !e.target.closest('.lang-drop')) {
                setOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [open])

    return (
        <>
            <div
                className="bg-white rounded-md text-black py-1 px-2 font-bold mr-auto lang-drop"
            >
                <p
                    onClick={() => setOpen(prevState => !prevState)}
                    className='flex items-center gap-2 cursor-pointer'
                >
                    {selectedLang?.icon} {isMinTablet && selectedLang?.name}{open ?
                        <IoIosArrowUp /> : <IoIosArrowDown />}
                </p>
                <div className="relative">
                    {open && <div className="absolute -left-3 top-2 text-black font-bold bg-white border-2 rounded-lg  p-1 grid grid-cols-2 md:grid-cols-1 gap-1 w-20 md:w-36">
                        {Object.keys(langs).map((l, key) =>
                            <div
                                key={key}
                                className={`${selectedLang?.code === langs[l]?.code && '!bg-slate-200'} hover:bg-slate-100 p-2 rounded-lg leading-none cursor-pointer`}
                                onClick={() => {
                                    i18n.changeLanguage(langs[l]?.code)
                                    setOpen(false)
                                }}
                            >
                                <p className="whitespace-nowrap">{langs[l]?.icon} {isMinTablet && langs[l]?.name}</p>
                            </div>
                        )}
                    </div>}
                </div>
            </div>
        </>
    )
}

export default LanguageDropdown