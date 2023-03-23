import { useEffect, useState } from "react"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"

const WindowScroll = () => {

    const [scrollTop, setScrollTop] = useState(0)
    const [isBottom, setIsBottom] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrollTop(window.scrollY)
            setIsBottom(window.innerHeight + window.scrollY >= document.body.offsetHeight - 100)
        }
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    })

    return (
        <div className='fixed z-50 right-2 bottom-2 flex flex-col border-2 rounded-xl bg-white gap-1 p-1'>
            {scrollTop > 0 && <button
                className="w-10 h-10 hover:bg-slate-100 rounded-lg flex items-center justify-center"
                onClick={() => window.scroll({
                    top: 0,
                    behavior: 'smooth'
                })}
            >
                <IoIosArrowUp />
            </button>}
            {isBottom && <button
                className="w-10 h-10 hover:bg-slate-100 rounded-lg flex items-center justify-center"
                onClick={() => window.scroll({
                    top: window.innerHeight,
                    behavior: 'smooth'
                })}
            >
                <IoIosArrowDown />
            </button>}
        </div>
    )
}

export default WindowScroll