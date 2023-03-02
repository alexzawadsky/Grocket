import { useMediaQuery } from 'react-responsive'
import { BsArrowLeft } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import MyProductsList from './MyProductsList'

const MyLots = () => {

    const isPhone = useMediaQuery({ query: '(max-width: 764px)' })

    return (
        <div className='grid gap-5 w-full'>
            {isPhone ? <NavLink className='flex items-center gap-2' to='/profile'><BsArrowLeft />Back to profile</NavLink> : null}
            <h1 className='font-bold text-3xl'>Active items</h1>
            <MyProductsList />
        </div>
    )
}

export default MyLots