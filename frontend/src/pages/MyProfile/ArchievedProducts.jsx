import { useMediaQuery } from 'react-responsive'
import { NavLink } from 'react-router-dom'
import { BsArrowLeft } from 'react-icons/bs'
import MyProductsList from './MyProductsList'

const Archieved = () => {

    const isPhone = useMediaQuery({ query: '(max-width: 764px)' })

    return (
        <div className='grid gap-5 w-full'>
            {isPhone ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
            <h1 className='font-bold text-3xl'>Archived items</h1>
            <MyProductsList query={{ is_archived: 1 }} />
        </div>
    )
}

export default Archieved