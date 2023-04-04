import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
import sv from 'javascript-time-ago/locale/sv.json'
import uk from 'javascript-time-ago/locale/uk.json'
import zh from 'javascript-time-ago/locale/zh.json'
import { useTranslation } from 'react-i18next'

import localization from '../../assets/localization.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)
TimeAgo.addLocale(sv)
TimeAgo.addLocale(uk)
TimeAgo.addLocale(zh)

const PublishTime = ({ full, pubDate }) => {

    const { i18n } = useTranslation()

    if (full) return new Date(pubDate).toLocaleDateString(
        undefined,
        {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }
    )

    return <ReactTimeAgo
        date={pubDate}
        locale={localization[i18n.resolvedLanguage.toUpperCase()].codeForTimeStamp}
    />
}

export default PublishTime