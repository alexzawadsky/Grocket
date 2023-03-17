import { NavLink, useParams } from "react-router-dom"
import useScreen from "../../hooks/useScreen"
import { BsArrowLeft } from "react-icons/bs"

const BackToProfile = () => {

    const { profileId } = useParams()
    const { isMinTablet } = useScreen()

    return !isMinTablet ?
        <NavLink className='flex items-center gap-2' to={`/users/${profileId}`}><BsArrowLeft />Back to profile</NavLink>
        :
        null
}

export default BackToProfile