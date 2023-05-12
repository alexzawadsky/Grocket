import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
    const { t } = useTranslation()

    return (
        <>
            <div className="flex flex-col md:flex-row mx-auto items-center gap-x-10 md:p-10 max-md:!pb-0 flex-wrap">
                <p className='font-bold text-accent-orange text-9xl max-md:mx-auto sm:text-[150px]'>404</p>
                <h1 className="font-bolditalic text-lg md:text-3xl text-center md:text-left max-md:pt-7 max-md:mx-auto">{t('404_text')}</h1>
            </div>
            <NavLink
                className="rounded-lg bg-accent-orange p-3 px-7 font-bold text-white hover:bg-accent-orange/[0.8] w-fit mx-auto md:text-xl max-md:mt-auto"
                to="/"
            >
                {t('back_to_mainpage')}
            </NavLink>
        </>
    )
}

export default NotFound
