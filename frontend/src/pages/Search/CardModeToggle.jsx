import { BsGridFill } from 'react-icons/bs'
import { MdViewAgenda } from 'react-icons/md'
import cn from 'classnames'

const CardModeToggle = ({ state, setState }) => {
    return (
        <div className="grid h-10 w-[76px] grid-cols-[1fr_1fr] gap-1 rounded-xl border-2 p-1 dark:border-zinc-600">
            <div
                className={cn(
                    state && '!cursor-default !bg-slate-200 dark:!bg-zinc-600',
                    `flex cursor-pointer items-center justify-center rounded-lg hover:bg-slate-100 hover:dark:bg-zinc-700`
                )}
                onClick={() => setState(true)}
            >
                <MdViewAgenda />
            </div>
            <div
                className={cn(
                    !state && '!cursor-default !bg-slate-200 dark:!bg-zinc-600',
                    `flex cursor-pointer items-center justify-center rounded-lg hover:bg-slate-100 hover:dark:bg-zinc-700`
                )}
                onClick={() => setState(false)}
            >
                <BsGridFill />
            </div>
        </div>
    )
}

export default CardModeToggle
