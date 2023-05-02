import { useState, useEffect } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import cn from 'classnames'
import { useSearchParams } from 'react-router-dom'
import { BsArrowDownRight, BsArrowUpRight } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'

const SortBy = ({ setPage }) => {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()
    const [searchParams, setSearchParams] = useSearchParams()

    const options = [
        {
            title: t('price_low_high'),
            code: 'price',
            icon: <BsArrowUpRight />,
        },
        {
            title: t('price_high_low'),
            code: '-price',
            icon: <BsArrowDownRight />,
        },
        {
            title: t('time_new_old'),
            code: '-pub_date',
            icon: <BsArrowDownRight />,
        },
        {
            title: t('time_old_new'),
            code: 'pub_date',
            icon: <BsArrowUpRight />,
        },
    ]

    const selectedOption =
        options.filter((el) => el?.code === searchParams.get('ordering'))[0] ||
        options[2]

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (open && !e.target.closest('.sortby-drop')) {
                setOpen(false)
            }
        }
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [open])

    return (
        <div>
            <p
                className="sortby-drop flex h-10 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2 font-bold dark:border-zinc-600 hover:dark:bg-zinc-700"
                onClick={() => {
                    setOpen((prevState) => !prevState)
                    setPage(0)
                }}
            >
                {selectedOption?.icon} {selectedOption?.title}{' '}
                {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </p>
            {open && (
                <div className="relative">
                    <ul className="absolute top-2 z-50 grid gap-1 rounded-xl border-2 bg-white p-1 dark:border-zinc-600 dark:bg-zinc-800">
                        {options.map((el, key) => (
                            <li
                                key={key}
                                onClick={() => {
                                    searchParams.set('ordering', el?.code)
                                    setSearchParams(searchParams)
                                }}
                                className={cn(
                                    `flex items-center gap-3 whitespace-nowrap`,
                                    el?.code === selectedOption?.code &&
                                        '!bg-slate-200 dark:!bg-zinc-600',
                                    `flex h-8 cursor-pointer items-center rounded-lg px-3 font-bold leading-none hover:bg-slate-100 hover:dark:bg-zinc-700`
                                )}
                            >
                                {el?.icon}
                                {el.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SortBy
