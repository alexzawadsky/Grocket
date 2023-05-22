import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { parse } from 'twemoji-parser'

const NoResponse = ({ className }) => {
    const { t } = useTranslation()
    const iconLink = parse('⚙️')[0]?.url

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <img className="w-5" src={iconLink} />
            {t('no_response')}
        </div>
    )
}

export default NoResponse
