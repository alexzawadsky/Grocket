import { useEffect, useState } from "react"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"

const WindowScroll = () => {

    const [isTop, setIsTop] = useState(false)
    const [isBottom, setIsBottom] = useState(true)

    useEffect(() => {
        const handleScroll = () => {
            const { scrollY, innerHeight } = window
            const { scrollHeight } = document.documentElement
            setIsTop(window.scrollY === 0)
            setIsBottom(scrollY + innerHeight >= scrollHeight)
        }
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className='fixed z-50 right-2 bottom-2 flex flex-col border-2 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 gap-1 p-1' aria-label="page scroll controls">
            {!isTop && <button
                aria-label='scroll up button'
                className="w-10 h-10 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-lg flex items-center justify-center"
                onClick={() => window.scroll({
                    top: 0,
                    behavior: 'smooth'
                })}
            >
                <IoIosArrowUp />
            </button>}
            {!isBottom && <button
                aria-label='scroll down button'
                className="w-10 h-10 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-lg flex items-center justify-center"
                onClick={() => window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth'
                })}
            >
                <IoIosArrowDown />
            </button>}
        </div>
    )
}

export default WindowScroll