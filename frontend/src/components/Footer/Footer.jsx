import { useTranslation } from 'react-i18next'
import FooterCol from './FooterCol'
import { BiNews, BiServer } from 'react-icons/bi'
import { BsGithub } from 'react-icons/bs'
import { AiOutlineInfoCircle, AiOutlineForm } from 'react-icons/ai'
import { RiHandHeartLine } from 'react-icons/ri'

const Footer = () => {
    const { t } = useTranslation()

    const footerData = [
        {
            title: t('about_project'),
            links: [
                {
                    icon: <BsGithub />,
                    name: 'Github',
                    url: 'https://github.com/alexzawadsky/Grocket',
                    blank: true,
                },
                {
                    icon: <AiOutlineInfoCircle />,
                    name: t('about_site'),
                    url: '/about-site',
                },
                {
                    icon: <AiOutlineForm />,
                    name: t('feedback_form'),
                    url: 'https://forms.gle/1ECKNCFyHhyCEkvL8',
                    blank: true,
                },
            ],
        },
        {
            title: t('about_team'),
            links: [
                {
                    icon: <BiNews />,
                    name: 'Frontend - Timur Ramazanov',
                    url: 'https://github.com/ramz1t',
                    blank: true,
                },
                {
                    icon: <BiServer />,
                    name: 'Backend - Alexey Zavadskiy',
                    url: 'https://github.com/alexzawadsky',
                    blank: true,
                },
                {
                    icon: <RiHandHeartLine />,
                    name: t('special_thanks'),
                    url: '/special-thanks',
                },
            ],
        },
    ]

    return (
        <footer
            className="mt-5 w-full bg-accent-orange"
            aria-label="website footer"
        >
            <div className="container mx-auto p-5 text-white dark:text-zinc-800">
                <ul
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    aria-label="footer links"
                >
                    {footerData.map((el, key) => (
                        <FooterCol col={el} key={key} />
                    ))}
                </ul>
                <p
                    className="my-auto mt-5 border-t border-t-white pt-2 font-bold dark:border-t-zinc-800"
                    aria-label="website version and name"
                >
                    © Grocket, {new Date().getFullYear()}{' '}
                    <span className="pl-2">v1.0.0</span>
                </p>
            </div>
        </footer>
    )
}

export default Footer
