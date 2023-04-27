import { BsGridFill } from 'react-icons/bs'
import { MdViewAgenda } from 'react-icons/md'
import cn from 'classnames'

const CardModeToggle = ({ state, setState }) => {
    return (
        <div className='grid grid-cols-[1fr_1fr] rounded-xl border-2 p-1 gap-1 h-10 w-[76px] dark:border-zinc-600'>
            <div
                className={cn(
                    state && '!bg-slate-200 dark:!bg-zinc-600 !cursor-default',
                    `hover:bg-slate-100 cursor-pointer hover:dark:bg-zinc-700 rounded-lg justify-center flex items-center`
                )}
                onClick={() => setState(true)}
            >
                <MdViewAgenda />
            </div>
            <div
                className={cn(
                    !state && '!bg-slate-200 dark:!bg-zinc-600 !cursor-default',
                    `hover:bg-slate-100 cursor-pointer hover:dark:bg-zinc-700 rounded-lg flex items-center justify-center`
                )}
                onClick={() => setState(false)}
            >
                <BsGridFill />
            </div>
        </div>
    )
}

export default CardModeToggle