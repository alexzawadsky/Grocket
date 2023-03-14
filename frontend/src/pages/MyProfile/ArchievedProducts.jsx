import { NavLink } from 'react-router-dom'
import { BsArrowLeft } from 'react-icons/bs'
import MyProductsList from './MyProductsList'
import useScreen from '../../hooks/useScreen'

const Archieved = () => {

    const { isMaxPhone } = useScreen()

    return (
        <div className='grid gap-5 w-full'>
            {isMaxPhone ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
            <h1 className='font-bold text-3xl'>Archived items</h1>
            <MyProductsList query={{ is_archived: 1 }} />
        </div>
    )
}

export default Archieved