import { NavLink, useParams } from 'react-router-dom'
import useScreen from '../../hooks/useScreen'
import { BsArrowLeft } from 'react-icons/bs'
import { useTranslation } from 'react-i18next'

const BackToProfile = () => {
    const { profileId } = useParams()
    const { t } = useTranslation()

    return (
        <NavLink
            className="flex w-fit items-center gap-2 hover:text-accent-orange"
            to={`/users/${profileId}`}
        >
            <BsArrowLeft />
            {t('back_to_profile')}
        </NavLink>
    )
}

export default BackToProfile
