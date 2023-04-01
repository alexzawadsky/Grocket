import UserProductsList from './UserProductsList'
import BackToProfile from './BackToProfile'
import { useParams } from 'react-router'
import useScreen from '../../hooks/useScreen'

const UserProductsPage = () => {

    const { profileId } = useParams()
    const { isMinTablet } = useScreen()

    return (
        <div className='grid gap-5 md:gap-3 w-full'>
            {((profileId === 'me' && !isMinTablet) ||
                (profileId !== 'me' && location.pathname !== `/users/${profileId}/items`)) &&
                <BackToProfile />}
            <UserProductsList />
        </div>
    )
}

export default UserProductsPage