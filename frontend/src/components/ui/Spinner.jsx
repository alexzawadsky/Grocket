import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Spinner = ({ gap }) => {

    const { t } = useTranslation()
    const [dots, setDots] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            if (dots.length < 3) {
                setDots(dots + '.')
            } else {
                setDots('')
            }
        }, [200])

        return () => clearInterval(interval)
    })

    return (
        <span className={`flex font-bold ${gap && 'pt-5 md:pl-5'}`}>
            <p>{t('loading')}</p>
            <p className="text-accent-orange min-w-[15px]">{dots}</p>
        </span>
    )
}

export default Spinner