import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'
import localization from '../../assets/json/localization.json'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
import sv from 'javascript-time-ago/locale/sv.json'
import uk from 'javascript-time-ago/locale/uk.json'
import zh from 'javascript-time-ago/locale/zh.json'
import fr from 'javascript-time-ago/locale/fr.json'
import de from 'javascript-time-ago/locale/de.json'
import nl from 'javascript-time-ago/locale/nl.json'
import ka from 'javascript-time-ago/locale/ka.json'
import it from 'javascript-time-ago/locale/it.json'
import pl from 'javascript-time-ago/locale/pl.json'

import { useTranslation } from 'react-i18next'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)
TimeAgo.addLocale(sv)
TimeAgo.addLocale(uk)
TimeAgo.addLocale(zh)
TimeAgo.addLocale(fr)
TimeAgo.addLocale(de)
TimeAgo.addLocale(ka)
TimeAgo.addLocale(nl)
TimeAgo.addLocale(it)
TimeAgo.addLocale(pl)

const PublishTime = ({ full, pubDate, style }) => {
    const { i18n } = useTranslation()

    if (!pubDate) return
    if (full)
        return new Date(pubDate).toLocaleDateString(i18n.resolvedLanguage, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        })

    return (
        <ReactTimeAgo
            date={pubDate}
            timeStyle={style}
            locale={
                localization[i18n.resolvedLanguage.toUpperCase()]
                    .codeForTimeStamp
            }
        />
    )
}

export default PublishTime
