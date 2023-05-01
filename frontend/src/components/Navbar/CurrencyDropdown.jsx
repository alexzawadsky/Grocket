import { useContext, useState, useEffect } from 'react'
import CurrencyContext from '../../contexts/CurrencyContext'
import getSymbolFromCurrency from 'currency-symbol-map'
import { Button } from '../ui'
import currencies from '../../assets/json/currencies.json'
import cn from 'classnames'
import useScreen from '../../hooks/useScreen'

const CurrencyDropdown = () => {
    const { targetCurrency, setTargetCurrency } = useContext(CurrencyContext)
    const [open, setOpen] = useState(false)
    const { isMinPC, isMinTablet } = useScreen()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.currency-drop')) {
                setOpen(false)
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
                onClick={() => setOpen((prevState) => !prevState)}
                className="currency-drop"
            >
                {getSymbolFromCurrency(targetCurrency)} {targetCurrency}
            </Button>
            <div className="relative">
                {open && (
                    <ul className="absolute -left-3 top-3 grid grid-cols-[1fr_1fr] gap-1 rounded-lg border-2 bg-white p-1 dark:border-zinc-600 dark:bg-zinc-800">
                        {currencies.map((c, key) => (
                            <li
                                key={key}
                                onClick={() => setTargetCurrency(c)}
                                className={cn(
                                    'flex h-8 cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-2 font-bold leading-none transition-all duration-100 hover:bg-slate-100 hover:dark:bg-zinc-700 md:h-10',
                                    targetCurrency === c &&
                                        '!bg-slate-200 dark:!bg-zinc-600'
                                )}
                            >
                                {getSymbolFromCurrency(c)} {c}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default CurrencyDropdown
