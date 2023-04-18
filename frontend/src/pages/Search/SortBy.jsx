import { useState, useEffect } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import cn from 'classnames'
import { useSearchParams } from 'react-router-dom'
import { BsArrowDownRight, BsArrowUpRight } from 'react-icons/bs'

const SortBy = () => {

    const [open, setOpen] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

    const options = [
        {
            title: 'Price Low-High',
            code: 'price',
            icon: <BsArrowUpRight />
        },
        {
            title: 'Price High-Low',
            code: '-price',
            icon: <BsArrowDownRight />
        },
        {
            title: 'Time New-Old',
            code: 'pub_date',
            icon: <BsArrowDownRight />
        },
        {
            title: 'Time Old-New',
            code: '-pub_date',
            icon: <BsArrowUpRight />
        },
    ]

    const selectedOption = options.filter(el => el?.code === searchParams.get('ordering'))[0] || options[2]

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (open && !e.target.closest('.sortby-drop')) {
                setOpen(false);
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
                className="flex items-center gap-3 sortby-drop font-bold border-2 h-10 rounded-xl py-2 px-3 cursor-pointer hover:dark:bg-zinc-700 dark:border-zinc-600"
                onClick={() => setOpen(prevState => !prevState)}
            >
                {selectedOption?.icon} {selectedOption?.title} {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </p>
            {open && <div className="relative">
                <ul className="absolute z-50 bg-white dark:bg-zinc-800 rounded-xl border-2 p-1 top-2 grid gap-1 dark:border-zinc-600">
                    {options.map((el, key) =>
                        <li
                            key={key}
                            onClick={() => {
                                searchParams.set('ordering', el?.code)
                                setSearchParams(searchParams)
                            }}
                            className={cn(
                                `whitespace-nowrap flex items-center gap-3`,
                                el?.code === selectedOption?.code && '!bg-slate-200 dark:!bg-zinc-600',
                                `cursor-pointer hover:bg-slate-100 hover:dark:bg-zinc-700 px-3 rounded-lg font-bold leading-none h-8 flex items-center`
                            )}
                        >
                            {el?.icon}
                            {el.title}
                        </li>)}
                </ul>
            </div>}
        </div>
    )
}

export default SortBy