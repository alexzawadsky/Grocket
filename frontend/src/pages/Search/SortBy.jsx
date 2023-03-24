import { useState, useEffect } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

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
                className="flex items-center gap-2 sortby-drop font-bold border-2 rounded-xl py-2 px-3 cursor-pointer"
                onClick={() => setOpen(prevState => !prevState)}
            >
                {selectedOption?.title} {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </p>
            {open && <div className="relative">
                <div className="absolute z-50 bg-white rounded-xl border-2 p-1 top-2 grid gap-1">
                    {options.map((el, key) =>
                        <p
                            key={key}
                            onClick={() => setSortBy(el?.code)}
                            className={`whitespace-nowrap ${el?.code === selectedOption?.code && '!bg-slate-200'} cursor-pointer hover:bg-slate-100 py-2 px-3 rounded-lg font-bold leading-none h-10 flex items-center`}
                        >
                            {el.title}
                        </p>)}
                </div>
            </div>}
        </div>
    )
}

export default SortBy