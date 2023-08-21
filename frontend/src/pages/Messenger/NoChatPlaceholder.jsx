import { useTranslation } from 'react-i18next'
import { parse } from 'twemoji-parser'

const NoChatPlaceholder = () => {
    const iconLink = parse('📭')[0]?.url
    const { t } = useTranslation()

    return (
        <span className="my-auto flex flex-col items-center gap-5 text-xl">
            <img
                className="w-20 brightness-90 dark:brightness-150"
                src={iconLink}
            />
            {t('no_chat')}
        </span>
    )
}

export default NoChatPlaceholder
