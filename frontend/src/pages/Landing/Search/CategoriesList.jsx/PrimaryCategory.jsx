import { IoIosArrowForward } from 'react-icons/io'
import { IoCarOutline } from 'react-icons/io5'
import { FaDog } from 'react-icons/fa'
import { BsPhone, BsGear, BsBrush, BsBriefcase } from 'react-icons/bs'
import { BiHomeAlt } from "react-icons/bi"
import { TbShirt, TbBuildingSkyscraper } from "react-icons/tb"
import { RiCustomerServiceLine } from 'react-icons/ri'
import { GrUserWorker } from 'react-icons/gr'

const icons = {
    26098: <FaDog />,
    26382: <BsBriefcase />,
    26195: <BsPhone />,
    26047: <BiHomeAlt />,
    26127: <TbShirt />,
    26113: <TbBuildingSkyscraper />,
    26486: <RiCustomerServiceLine />,
    30757: <BsGear />,
    25984: <IoCarOutline />,
    26400: <GrUserWorker />,
    26315: <BsBrush />
}

const PrimaryCategory = ({ category, onChange }) => {
    return (
        <div
            className='hover:bg-slate-100 gap-2 rounded-lg p-3 pr-5 hover:pr-3 flex items-center justify-between transition-all font-bold'
            onMouseEnter={onChange}
            onClick={onChange}
        >
            <div>
                {icons[category.id]}
            </div>
            <p className="mr-auto">{category.title}</p>
            <div>
                <IoIosArrowForward />
            </div>
        </div>
    )
}

export default PrimaryCategory