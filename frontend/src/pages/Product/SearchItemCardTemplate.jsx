const SearchItemCardTemplate = ({ horizontal }) => {

    if (!horizontal) return (
        <div className="p-5 h-full" aria-hidden='true'>
            <div className="bg-slate-50/[.8] dark:bg-zinc-700/[.6] grid gap-1 rounded-xl">
                <div className='bg-slate-100 dark:bg-zinc-700 rounded-xl aspect-[4/3]'></div>
                <div className='p-4 grid gap-2'>
                    <p className="h-6 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-8 bg-slate-100 w-3/5 dark:bg-zinc-700"></p>
                    <p className="h-4 bg-slate-100 w-4/5 dark:bg-zinc-700"></p>
                    <p className="h-4 bg-slate-100 w-4/5 dark:bg-zinc-700"></p>
                    <p className="h-4 bg-slate-100 w-4/5 dark:bg-zinc-700"></p>
                </div>
            </div>
        </div>

    )

    return (
        <div className="p-5" aria-hidden='true'>
            <div className='grid grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2fr_1fr] bg-slate-50/[.8] dark:bg-zinc-700/[.6] rounded-2xl overflow-hidden'>
                <div className='bg-slate-100 aspect-[4/3] dark:bg-zinc-700'></div>
                <div className='p-4 grid grid-rows-6 gap-1'>
                    <p className=" bg-slate-100 w-44 dark:bg-zinc-700"></p>
                    <p className=" bg-slate-100 w-full  dark:bg-zinc-700"></p>
                    <p className=" bg-slate-100 w-52  dark:bg-zinc-700"></p>
                    <p className=" bg-slate-100 w-44 dark:bg-zinc-700"></p>
                    <p className=" bg-slate-100 w-44 dark:bg-zinc-700"></p>
                    <p className=" bg-slate-100 w-44 dark:bg-zinc-700"></p>
                </div>
                <div className='px-4 py-7 hidden xl:flex gap-4 text-sm h-full'>
                    <div className='w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-700'></div>
                    <div className="grid h-fit gap-2 grow">
                        <p className="h-4 bg-slate-100 w-4/5 dark:bg-zinc-700"></p>
                        <p className="h-4 bg-slate-100 w-full dark:bg-zinc-700"></p>
                        <p className="h-4 bg-slate-100 w-2/3 dark:bg-zinc-700"></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchItemCardTemplate