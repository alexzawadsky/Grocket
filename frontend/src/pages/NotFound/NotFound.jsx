import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
    const { t } = useTranslation()

    return (
        <>
            <div className="mx-auto flex flex-col items-center gap-x-10 max-md:!pb-0 md:flex-row md:p-10">
                <p className="text-9xl font-bold text-accent-orange max-md:mx-auto sm:text-[150px]">
                    404
                </p>
                <h1 className="text-center font-bolditalic text-lg max-md:mx-auto max-md:pt-7 md:text-left md:text-3xl">
                    {t('404_text')}
                </h1>
            </div>
            <NavLink
                className="mx-auto w-fit rounded-lg bg-accent-orange p-3 px-7 font-bold text-white hover:bg-accent-orange/[0.8] max-md:mt-auto md:text-xl"
                to="/"
            >
                {t('back_to_mainpage')}
            </NavLink>
        </>
    )
}

export default NotFound
