import { useTranslation } from "react-i18next"
import { NavLink } from "react-router-dom"
import { BiNews, BiServer } from "react-icons/bi"
import { BsGithub } from 'react-icons/bs'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { CgMoreO } from 'react-icons/cg'
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
                    blank: true
                },
                {
                    icon: <AiOutlineInfoCircle />,
                    name: t('about_site'),
                    url: '/about-site'
                }
            ]
        },
        {
            title: t('about_team'),
            links: [
                {
                    icon: <BiNews />,
                    name: 'Frontend - Timur Ramazanov',
                    url: 'https://github.com/ramz1t',
                    blank: true
                },
                {
                    icon: <BiServer />,
                    name: 'Backend - Alexey Zavadskiy',
                    url: 'https://github.com/alexzawadsky',
                    blank: true
                },
                {
                    icon: <CgMoreO />,
                    name: t('learn_more'),
                    url: '/about-team'
                },
                {
                    icon: <RiHandHeartLine />,
                    name: 'Special thanks',
                    url: '/special-thanks'
                }
            ]
        }
    ]

    return (
        <footer className='w-full bg-accent-orange mt-5'>
            <div className="container mx-auto p-5 text-white">
                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {footerData.map((el, key) => <li key={key}>
                        <h3 className="font-bold text-lg mb-1">{el?.title}</h3>
                        <ul>
                            {el?.links.map((link, key) => <li>
                                <NavLink
                                    key={key}
                                    to={link?.url}
                                    target={link?.blank && '_blank'}
                                    className='flex items-center gap-2 text-sm md:text-md hover:text-white/[.8] w-fit'
                                >
                                    {link?.icon}
                                    {link?.name}
                                </NavLink>
                            </li>
                            )}
                        </ul>
                    </li>)}
                </ul>
                <p className="my-auto font-bold border-t border-t-white pt-2 mt-5">© Grocket, {new Date().getFullYear()} <span className="pl-2">v1.0.0</span></p>
            </div>
        </footer>
    )
}

export default Footer