import { NavLink } from 'react-router-dom'
import { ProductsList, Title } from '../../components'
import { BsArrowLeft } from 'react-icons/bs'
import { AiFillHeart } from 'react-icons/ai'
import useScreen from '../../hooks/useScreen'

const MyFavourites = () => {

    const { isMaxPhone } = useScreen()

    return (
        <div className='grid gap-5 w-full'>
            {isMaxPhone ?
                <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink>
                :
                null
            }
            <div className='flex items-center gap-2'><p className='text-accent-red text-3xl'><AiFillHeart /></p><Title text='Favourites' /></div>
            <ProductsList query={{ is_favourited: true }} />
        </div>
    )
}

export default MyFavourites