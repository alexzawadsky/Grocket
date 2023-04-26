import React, { useContext, useEffect, useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import { BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs'
import { TbSunMoon, TbSun, TbMoon, TbMoonFilled, TbSunFilled } from 'react-icons/tb'
import { Button } from '../ui'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import ThemeContext from '../../contexts/ThemeContext'

const ThemeToggle = () => {

    const [open, setOpen] = useState(false)
    const { t } = useTranslation()
    const { themeSetting, setThemeSetting, isDark } = useContext(ThemeContext)

    const options = {
        light: {
            title: t('light'),
            menuIcon: <TbSun />,
            code: 'light'
        },
        dark: {
            title: t('dark'),
            menuIcon: <TbMoon />,
            code: 'dark'
        },
        auto: {
            title: t('auto'),
            menuIcon: <TbSunMoon />,
            code: 'auto'
        }
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.theme-drop')) setOpen(false)
        }
        document.addEventListener('click', handleClickOutside)

        return () => document.removeEventListener('click', handleClickOutside)
    }, [])



    return (
        <div className='theme-drop h-full'>
            <Button
                onClick={() => setOpen(prevState => !prevState)}
                border={false}
                height='full'
                className='!gap-1'
            >
                {isDark ? <TbMoonFilled /> : <TbSunFilled />}
                {options[themeSetting].title}
            </Button>
            <div className="relative">
                {open && <ul className="absolute bg-white dark:bg-zinc-800 grid gap-1 top-3 p-1 border-2 dark:border-zinc-600 rounded-md -left-3">
                    {Object.keys(options).map(key => <li key={key}>
                        <Button
                            onClick={() => setThemeSetting(options[key].code)}
                            border={false}
                            className={cn(
                                'md:h-10 !rounded-md hover:bg-slate-100 hover:dark:bg-zinc-700',
                                themeSetting === options[key].code && '!bg-slate-200 dark:!bg-zinc-600'
                            )}
                            height={8}
                            px={2}
                            width='full'
                        >
                            {options[key].menuIcon} {options[key].title}
                        </Button>
                    </li>)}
                </ul>}
            </div>
        </div>
    )
}

export default ThemeToggle