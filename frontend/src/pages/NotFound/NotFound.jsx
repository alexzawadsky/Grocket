import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
    const { t } = useTranslation()

    return (
        <div className="container mx-auto flex h-full w-full flex-col items-center justify-center gap-10 p-5 text-center">
            <h1 className="font-bolditalic text-3xl">{t('404_text')}</h1>
            <NavLink
                className="rounded-lg bg-accent-orange p-3 px-5 font-bold text-white hover:bg-accent-orange/[0.8]"
                to="/"
            >
                {t('back_to_mainpage')}
            </NavLink>
        </div>
    )
}

export default NotFound
