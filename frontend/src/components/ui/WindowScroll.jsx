import { useEffect, useState, useContext } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import CategoriesListStateContext from '../../contexts/CategoriesListStateContext'

const WindowScroll = () => {
    const [isTop, setIsTop] = useState(true)
    const [isBottom, setIsBottom] = useState(false)
    const [hasScroll, setHasScroll] = useState(false)
    const { open } = useContext(CategoriesListStateContext)
    const [hidden, setHidden] = useState(false)

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

    useEffect(() => {
        setHasScroll(document.body.scrollHeight > document.body.clientHeight)
    }, [document.body.scrollHeight])

    if (hidden) return
    if (open) return
    if (!hasScroll) return

    return (
        <div
            className="fixed bottom-2 right-2 z-50 flex flex-col gap-1 rounded-xl border-2 bg-white p-1 dark:border-zinc-600 dark:bg-zinc-800"
            aria-label="page scroll controls"
        >
            {!isTop && (
                <button
                    aria-label="scroll up button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700"
                    onClick={() =>
                        window.scroll({
                            top: 0,
                            behavior: 'smooth',
                        })
                    }
                >
                    <IoIosArrowUp />
                </button>
            )}
            {!isBottom && (
                <button
                    aria-label="scroll down button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700"
                    onClick={() =>
                        window.scrollTo({
                            top: document.documentElement.scrollHeight,
                            behavior: 'smooth',
                        })
                    }
                >
                    <IoIosArrowDown />
                </button>
            )}
        </div>
    )
}

export default WindowScroll
