import { useState, useEffect } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import cn from 'classnames'

const SortBy = ({ sortBy, setSortBy }) => {

    const [open, setOpen] = useState(false)

    const options = [
        {
            title: 'Price Low-High',
            code: 'price'
        },
        {
            title: 'Price High-Low',
            code: '-price'
        },
        {
            title: 'Time New-Old',
            code: 'time'
        },
        {
            title: 'Time Old-New',
            code: '-time'
        }
    ]

    const selectedOption = options.filter(el => el?.code === sortBy)[0]

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
                className="flex items-center gap-2 sortby-drop font-bold border-2 h-10 rounded-xl py-2 px-3 cursor-pointer hover:dark:bg-zinc-700 dark:border-zinc-600"
                onClick={() => setOpen(prevState => !prevState)}
            >
                {selectedOption?.title} {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </p>
            {open && <div className="relative">
                <ul className="absolute z-50 bg-white dark:bg-zinc-800 rounded-xl border-2 p-1 top-2 grid gap-1 dark:border-zinc-600">
                    {options.map((el, key) =>
                        <li
                            key={key}
                            onClick={() => setSortBy(el?.code)}
                            className={cn(
                                `whitespace-nowrap`,
                                el?.code === selectedOption?.code && '!bg-slate-200 dark:!bg-zinc-600',
                                `cursor-pointer hover:bg-slate-100 hover:dark:bg-zinc-700 px-3 rounded-lg font-bold leading-none h-8 flex items-center`
                            )}
                        >
                            {el.title}
                        </li>)}
                </ul>
            </div>}
        </div>
    )
}

export default SortBy