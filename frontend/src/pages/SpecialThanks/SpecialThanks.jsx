import React from 'react'
import { Title } from '../../components/ui'
import { useTranslation } from 'react-i18next'
import { BsInstagram } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import tetrapak from '../../assets/icons/tetra-pak.svg'

const SpecialThanks = () => {
    const { t } = useTranslation()

    const list = [
        {
            name: 'Skuchalina Sofia',
            url: 'https://instagram.com/sonyaskuch207?igshid=NTc4MTIwNjQ2YQ==',
            urlName: 'Instagram',
            role: `FR, DE ${t('translation')}`,
            icon: <BsInstagram />,
            color: 'text-gradient bg-gradient-to-r from-purple-400 to-pink-500',
        },
        {
            name: 'Anonymous employees from TetraPak :)',
            url: 'https://www.tetrapak.com/',
            urlName: 'Website',
            role: `PL, SV, IT, ZH ${t('translation')}`,
            icon: <img src={tetrapak} className="h-5 w-5 rounded-md" />,
            color: 'bg-zinc-50 dark:bg-white !text-[#3b4890]',
        },
    ]

    return (
        <>
            <Title>{t('special_thanks')} 🎉</Title>
            <ul className="flex flex-wrap gap-3">
                {list.map((el, key) => (
                    <li
                        key={key}
                        className="grid rounded-lg border p-3 dark:border-2 dark:border-zinc-600 md:p-5"
                    >
                        <p className="text-lg font-bold">{el.name}</p>
                        <p>{el.role}</p>
                        <Link
                            to={el.url}
                            className={cn(
                                'mt-2 flex w-fit items-center gap-1 rounded-md px-2 py-1 font-bold text-white hover:shadow-md',
                                el.color
                            )}
                            target="_blank"
                        >
                            {el.icon} {el.urlName}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default SpecialThanks
