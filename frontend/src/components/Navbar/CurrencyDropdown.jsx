import { useContext, useState, useEffect } from "react"
import CurrencyContext from "../../contexts/CurrencyContext"
import getSymbolFromCurrency from 'currency-symbol-map'
import { Button } from "../ui"
import currencies from '../../assets/json/currencies.json'
import cn from 'classnames'
import useScreen from "../../hooks/useScreen"

const CurrencyDropdown = () => {

    const { targetCurrency, setTargetCurrency } = useContext(CurrencyContext)
    const [open, setOpen] = useState(false)
    const { isMinPC, isMinTablet } = useScreen()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.currency-drop')) {
                setOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <div>
            <Button
                border={false}
                onClick={() => setOpen(prevState => !prevState)}
                className='currency-drop'
            >
                {getSymbolFromCurrency(targetCurrency)} {(isMinPC || !isMinTablet) && targetCurrency}
            </Button>
            <div className="relative">
                {open && <ul className="absolute border-2 dark:border-zinc-600 rounded-lg p-1 grid grid-cols-[1fr_1fr] bg-white dark:bg-zinc-800 gap-1 -left-3 top-3">
                    {currencies.map((c, key) => <li
                        key={key}
                        onClick={() => setTargetCurrency(c)}
                        className={cn(
                            'hover:bg-slate-100 h-8 md:h-10 whitespace-nowrap transition-all duration-100 px-2 hover:dark:bg-zinc-700 font-bold rounded-md leading-none cursor-pointer flex items-center gap-2',
                            targetCurrency === c && '!bg-slate-200 dark:!bg-zinc-600'
                        )}
                    >
                        {getSymbolFromCurrency(c)} {c}
                    </li>)}
                </ul>}
            </div>
        </div>
    )
}

export default CurrencyDropdown