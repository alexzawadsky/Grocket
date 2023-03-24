import { BsGridFill } from 'react-icons/bs'
import { MdViewAgenda } from 'react-icons/md'

const CardModeToggle = ({ state, setState }) => {
    return (
        <div className='grid grid-cols-2 rounded-xl border-2 p-1 gap-1'>
            <div
                className={`${state && '!bg-slate-200'} hover:bg-slate-100 rounded-lg p-2 aspect-square`}
                onClick={() => setState(true)}
            >
                <MdViewAgenda />
            </div>
            <div
                className={`${!state && '!bg-slate-200'} hover:bg-slate-100 rounded-lg p-2 aspect-square`}
                onClick={() => setState(false)}
            >
                <BsGridFill />
            </div>
        </div>
    )
}

export default CardModeToggle