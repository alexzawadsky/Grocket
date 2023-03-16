import { useTranslation } from "react-i18next"
import langs from '../assets/localization.json'
import useLocalStorage from "../hooks/useLocalStorage"

const Footer = () => {

    const { i18n, t } = useTranslation()
    const [selected, setSelected] = useLocalStorage('languageSelected', '')

    const changeLang = (e) => {
        i18n.changeLanguage(e.target.value)
        setSelected(true)
    }

    const year = new Date().getFullYear()

    return (
        <footer className='w-full bg-accent-orange mt-5'>
            <div className="container mx-auto p-5 text-white flex">
                <p className="my-auto font-bold">© Grocket, {year}</p>
                <select
                    className="ml-auto bg-white rounded-md border-2 border-accent-orange text-accent-orange py-1 px-2 font-bold"
                    value={i18n.resolvedLanguage}
                    onChange={changeLang}
                >
                    <option className="">{t('choose_lang')}</option>
                    {Object.keys(langs).map((l, key) =>
                        <option
                            key={key}
                            value={langs[l]?.code}
                        >
                            {langs[l]?.name}
                        </option>
                    )}
                </select>
            </div>

        </footer>
    )
}

export default Footer