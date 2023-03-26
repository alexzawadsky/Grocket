import { NavLink, useParams } from "react-router-dom"
import useScreen from "../../hooks/useScreen"
import { BsArrowLeft } from "react-icons/bs"

const BackToProfile = () => {

    const { profileId } = useParams()
    const { isMinTablet } = useScreen()

    return <NavLink className='flex items-center gap-2 hover:text-accent-orange' to={isMinTablet ? `/users/${profileId}/items` : `/users/${profileId}`}><BsArrowLeft />Back to profile</NavLink>

}

export default BackToProfile