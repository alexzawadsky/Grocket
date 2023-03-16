import { useTranslation } from "react-i18next"

const langs = [
    {
        name: 'English',
        code: 'en'
    },
    {
        name: 'Русский',
        code: 'ru'
    }
]

const Footer = () => {

    const { i18n, t } = useTranslation()

    const changeLang = (e) => {
        i18n.changeLanguage(e.target.value)
    }

    return (
        <footer className='w-full bg-accent-orange mt-5'>
            <div className="container mx-auto p-5 text-white flex">
                <p>© Grocket, 2023</p>
                <select className="ml-auto bg-none text-black" onChange={changeLang}>
                    <option>{t('choose_lang')}</option>
                    {langs.map((l, key) => <option key={key} value={l.code}>{l.name}</option>)}
                </select>
            </div>

        </footer>
    )
}

export default Footer