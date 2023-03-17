import { NavLink, useParams } from "react-router-dom"
import { BsArrowLeft } from "react-icons/bs"
import { useTranslation } from "react-i18next"
import { Title } from "../../components"
import { useState } from "react"

const AddComment = () => {

    const { t } = useTranslation()
    const { profileId } = useParams()
    const [stage, setStage] = useState(1)

    return (
        <div className="grid gap-3">
            <NavLink className='flex items-center gap-2 hover:text-accent-orange' to={`/users/${profileId}/comments`}>
                <BsArrowLeft />{t('back_to_comments')}
            </NavLink>
            <Title text={t('add_comment')} />
            {stage >= 1 &&
                <div>
                    stage 1
                    <button onClick={() => setStage(2)}>2</button>
                    <button onClick={() => setStage(1)}>reset</button>
                </div>
            }
            {stage >= 2 &&
                <div>
                    form
                    <button>send</button>
                </div>
            }
        </div>
    )
}

export default AddComment