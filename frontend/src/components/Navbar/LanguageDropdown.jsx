import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import langs from '../../assets/localization.json'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import useScreen from "../../hooks/useScreen"
import Flag from '../ui/Flag'
import { Button } from "../ui"


const LanguageDropdown = () => {

    const { i18n } = useTranslation()
    const [open, setOpen] = useState(false)
    const selectedLang = langs[i18n.resolvedLanguage.toUpperCase()]
    const { isMinTablet } = useScreen()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.lang-drop')) {
                setOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <div className="rounded-md text-black dark:text-slate-50 font-bold lang-drop h-full">
            <Button
                onClick={() => setOpen(prevState => !prevState)}
                className='flex items-center gap-2 cursor-pointer'
                border={false}
            >

                <Flag
                    className='h-10 w-5'
                    country={selectedLang?.flag}
                    size={64}
                />

                <p>{selectedLang?.name}</p>
                {/* {open ? <IoIosArrowUp /> : <IoIosArrowDown />} */}
            </Button>
            <div className="relative">
                {open && <ul className="absolute -left-3 top-1 text-black dark:text-slate-50 font-bold bg-white dark:bg-zinc-800 border-2 dark:border-zinc-600 rounded-lg  p-1 grid grid-cols-2  gap-1 w-20 md:w-80">
                    {Object.keys(langs).map((l, key) =>
                        <li
                            key={key}
                            className={`${selectedLang?.code === langs[l]?.code && '!bg-slate-200 dark:!bg-zinc-600'} hover:bg-slate-100 hover:dark:bg-zinc-700 px-2 py-1 md:py-2 rounded-md leading-none cursor-pointer flex items-center gap-2`}
                            onClick={() => {
                                i18n.changeLanguage(langs[l]?.code)
                                setOpen(false)
                            }}
                        >
                            <div className="h-6 w-[24px] md:w-5 flex items-center">
                                <Flag country={langs[l]?.flag} size={64} />
                            </div>
                            {isMinTablet &&
                                <p className="whitespace-nowrap">{isMinTablet && langs[l]?.name}</p>}
                        </li>
                    )}
                </ul>}
            </div>
        </div>

    )
}

export default LanguageDropdown