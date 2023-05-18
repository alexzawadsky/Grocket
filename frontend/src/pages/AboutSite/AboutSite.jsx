import ThemeContext from '../../contexts/ThemeContext'
import { useContext } from 'react'

const AboutSite = () => {
    const { isDark } = useContext(ThemeContext)

    return (
        <>
            <section className="my-5 grid w-full items-center gap-10 md:my-14 md:grid-cols-[1fr_1fr]">
                <div className="grid gap-3">
                    <p className="pl-1.5 font-bold text-zinc-600">
                        INTRODUCING
                    </p>
                    <h1 className="font-bolditalic text-6xl text-accent-orange md:text-8xl">
                        Grocket
                    </h1>
                    <p className="pl-1.5 font-bold">
                        Grocket is an international online marketplace that
                        specializes in secondhand items. It provides a platform
                        for users to buy and sell a variety of used goods from
                        all over the world, including clothing, electronics,
                        furniture, and more.
                    </p>
                </div>
                <img src={isDark ? './dark-mock.png' : './light-mock.png'} />
            </section>
        </>
    )
}

export default AboutSite
