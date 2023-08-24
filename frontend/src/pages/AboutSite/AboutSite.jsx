import { useTranslation } from 'react-i18next'
import ThemeContext from '../../contexts/ThemeContext'
import { useContext } from 'react'

const AboutSite = () => {
    const { isDark } = useContext(ThemeContext)
    const { t } = useTranslation()

    return (
        <>
            <section className="my-5 grid w-full items-center gap-10 md:my-14 md:grid-cols-[1fr_1fr]">
                <div className="grid gap-3">
                    <p className="pl-1.5 font-bold text-zinc-600 dark:text-zinc-400">
                        {t('introducing')}
                    </p>
                    <h1 className="font-bolditalic text-6xl text-accent-orange md:text-8xl">
                        Grocket
                    </h1>
                    <p className="pl-1.5 font-bold">{t('about_text')}</p>
                </div>
                <img src={isDark ? './dark-mock.png' : './light-mock.png'} />
            </section>
        </>
    )
}

export default AboutSite
