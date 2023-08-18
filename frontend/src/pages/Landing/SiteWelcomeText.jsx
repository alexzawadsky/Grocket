import { useEffect, useRef } from 'react'
import useScreen from '../../hooks/useScreen'
import { Title } from '../../components/ui'
import useLocalStorage from '../../hooks/useLocalStorage'
import { useTranslation } from 'react-i18next'

const SiteWelcomeText = () => {
    const { isMinTablet } = useScreen()
    const r = document.querySelector(':root')
    const colorSelectorRef = useRef()
    const [color, setColor] = useLocalStorage('accentColor', '#FF9001')
    const { t } = useTranslation()

    useEffect(() => {
        r.style.setProperty('--primary', color)
    }, [])

    if (!isMinTablet) return

    return (
        <Title
            className="pb-5 !text-2xl md:pb-0 md:pl-5 lg:!text-3xl"
            text={
                <>
                    {t('goods_for_you')}
                    <span className="relative ml-3 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:rounded-sm before:bg-accent-orange">
                        <span
                            className="relative text-white"
                            onClick={() => colorSelectorRef.current.click()}
                        >
                            {t('you')}
                        </span>
                    </span>
                    <input
                        ref={colorSelectorRef}
                        type="color"
                        className="hidden"
                        onChange={(e) => {
                            setColor(e.target.value)
                            r.style.setProperty('--primary', e.target.value)
                        }}
                    />
                </>
            }
        />
    )
}

export default SiteWelcomeText
