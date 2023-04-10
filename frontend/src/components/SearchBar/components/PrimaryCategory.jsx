import { IoIosArrowForward } from 'react-icons/io'
import {
    IoCarOutline, IoShirtOutline, IoShirtSharp,
    IoCarSharp, IoConstructOutline, IoConstructSharp
} from 'react-icons/io5'
import {
    BsPhone, BsGear, BsBrush, BsHouse, BsHouseFill,
    BsBriefcase, BsBriefcaseFill, BsPhoneFill,
    BsGearFill, BsBrushFill
} from 'react-icons/bs'
import { RiCustomerServiceLine, RiBuilding2Line, RiBuilding2Fill, RiCustomerServiceFill } from 'react-icons/ri'
import { useState } from 'react'
import PigFill from '../../../assets/icons/pig-icon-fill.png'
import PigOutline from '../../../assets/icons/pig-icon-outline.png'

const icons = {
    26098: {
        notHover: <img width='17px' height='17px' className='dark:invert' src={PigOutline} />,
        hover: <img width='17px' height='17px' className='dark:invert' src={PigFill} />
    },
    26382: {
        notHover: <BsBriefcase />,
        hover: <BsBriefcaseFill />
    },
    26195: {
        notHover: <BsPhone />,
        hover: <BsPhoneFill />
    },
    26047: {
        notHover: <BsHouse />,
        hover: <BsHouseFill />
    },
    26127: {
        notHover: <IoShirtOutline />,
        hover: <IoShirtSharp />
    },
    26113: {
        notHover: <RiBuilding2Line />,
        hover: <RiBuilding2Fill />
    },
    26486: {
        notHover: <RiCustomerServiceLine />,
        hover: <RiCustomerServiceFill />
    },
    30757: {
        notHover: <BsGear />,
        hover: <BsGearFill />
    },
    25984: {
        notHover: <IoCarOutline />,
        hover: <IoCarSharp />
    },
    26400: {
        notHover: <IoConstructOutline />,
        hover: <IoConstructSharp />
    },
    26315: {
        notHover: <BsBrush />,
        hover: <BsBrushFill />
    },
}

const PrimaryCategory = ({ category, onChange }) => {

    const [hover, setHover] = useState(false)

    return (
        <li
            className='hover:bg-slate-100 hover:dark:bg-zinc-700 gap-2 rounded-lg p-3 pr-5 hover:pr-3 flex items-center justify-between transition-all font-bold'
            onMouseEnter={() => {
                onChange()
                setHover(true)
            }}
            onMouseLeave={() => {
                setHover(false)
            }}
            onClick={onChange}
        >
            <div>
                {hover ? icons[category.id].hover : icons[category.id].notHover}
            </div>
            <p className="mr-auto">{category.title}</p>
            <div>
                <IoIosArrowForward />
            </div>
        </li>
    )
}

export default PrimaryCategory