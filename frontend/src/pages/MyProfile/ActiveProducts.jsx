import { BsArrowLeft } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import MyProductsList from './MyProductsList'
import useScreen from '../../hooks/useScreen'

const MyLots = () => {

    const { isMaxPhone } = useScreen()

    return (
        <div className='grid gap-5 w-full'>
            {isMaxPhone ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
            <h1 className='font-bold text-3xl'>Active items</h1>
            <MyProductsList />
        </div>
    )
}

export default MyLots