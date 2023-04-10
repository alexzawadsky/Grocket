import React, { useEffect, useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import { BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs'
import { TbSunMoon } from 'react-icons/tb'
import { Button } from '../ui'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

const ThemeToggle = () => {

    const [themeSetting, setThemeSetting] = useLocalStorage('theme', 'auto')
    const [open, setOpen] = useState(false)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const [isDark, setIsDark] = useState(mediaQuery.matches)
    const [localDark, setLocalDark] = useState(false)
    const html = document.querySelector('html')
    const { t } = useTranslation()
    const moonIcon = <BsMoonStarsFill scale={1.2} />
    const sunIcon = <BsFillSunFill scale={1.2} />

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (open && !e.target.closest('.theme-drop')) {
                setOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (themeSetting === 'light') {
            setLocalDark(false)
            html.classList.remove('dark')
        }
        if (themeSetting === 'dark') {
            setLocalDark(true)
            html.classList.add('dark')
        }
        if (themeSetting === 'auto') {
            setLocalDark(mediaQuery.matches)
            mediaQuery.matches ? html.classList.add('dark') : html.classList.remove('dark')
        }

        const handleChange = () => setIsDark(mediaQuery.matches)
        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [themeSetting, isDark])

    return (
        <div className='theme-drop'>
            <button onClick={() => setOpen(prevState => !prevState)} className='p-2'>
                {localDark ?
                    moonIcon : sunIcon
                }
            </button>
            <div className="relative">
                {open && <div className="absolute bg-white dark:bg-zinc-800 grid gap-1 p-1 top-3 border dark:border-2 dark:border-zinc-600 rounded-md -right-2">
                    <Button
                        onClick={() => setThemeSetting('light')}
                        border={false}
                        className={cn(
                            'flex !rounded-md items-center gap-2 hover:bg-slate-100 hover:dark:bg-zinc-700',
                            themeSetting === 'light' && '!bg-slate-200 dark:!bg-zinc-600'
                        )}
                        height={10}
                        px={3}
                    >
                        {sunIcon} {t('light')}
                    </Button>
                    <Button
                        onClick={() => setThemeSetting('dark')}
                        border={false}
                        className={cn(
                            'flex !rounded-md items-center gap-2 hover:bg-slate-100 hover:dark:bg-zinc-700',
                            themeSetting === 'dark' && '!bg-slate-200 dark:!bg-zinc-600'
                        )}
                        height={10}
                        px={3}
                    >
                        {moonIcon} {t('dark')}
                    </Button>
                    <Button
                        onClick={() => setThemeSetting('auto')}
                        border={false}
                        className={cn(
                            'flex !rounded-md items-center gap-2 hover:bg-slate-100 hover:dark:bg-zinc-700',
                            themeSetting === 'auto' && '!bg-slate-200 dark:!bg-zinc-600'
                        )}
                        height={10}
                        px={3}
                    >
                        <TbSunMoon size={20} />{t('auto')}
                    </Button>
                </div>}
            </div>


        </div>
    )
}

export default ThemeToggle