import { useTranslation } from "react-i18next"
import langs from '../assets/localization.json'
import { MdOutlineLanguage } from 'react-icons/md'

const Footer = () => {

    const { i18n, t } = useTranslation()

    const changeLang = (e) => {
        i18n.changeLanguage(e.target.value)
    }

    const year = new Date().getFullYear()

    return (
        <footer className='w-full bg-accent-orange mt-5'>
            <div className="container mx-auto p-5 text-white flex">
                <p className="my-auto font-bold">© Grocket, {year}</p>


            </div>

        </footer>
    )
}

export default Footer