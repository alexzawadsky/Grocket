const SearchItemCardTemplate = ({ horizontal }) => {

    if (!horizontal) return (
        <div className="p-5 h-full">
            <div className="bg-slate-50/[.8] grid gap-1 rounded-xl">
                <div style={{ aspectRatio: '4/3' }} className=' bg-slate-100 rounded-xl'></div>
                <div className='p-4 grid gap-2'>
                    <p className="h-6 bg-slate-100"></p>
                    <p className="h-8 bg-slate-100 w-3/5"></p>
                    <p className="h-4 bg-slate-100 w-4/5"></p>
                    <p className="h-4 bg-slate-100 w-4/5"></p>
                    <p className="h-4 bg-slate-100 w-4/5"></p>
                </div>
            </div>
        </div>

    )

    return (
        <div className="p-5">
            <div className='grid grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2fr_1fr] bg-slate-50/[.8] rounded-2xl overflow-hidden'>
                <div className='h-52 bg-slate-100'></div>
                <div className='p-4 grid gap-2'>
                    <p className="h-6 bg-slate-100 w-44"></p>
                    <p className="h-8 bg-slate-100 w-full"></p>
                    <p className="h-8 bg-slate-100 w-52"></p>
                    <p className="h-4 bg-slate-100 w-44"></p>
                    <p className="h-4 bg-slate-100 w-44"></p>
                    <p className="h-4 bg-slate-100 w-44"></p>
                </div>
                <div className='px-4 py-7 hidden lg:flex gap-4 text-sm h-full'>
                    <div className='w-10 h-10 rounded-full bg-slate-100'></div>
                    <div className="grid h-fit gap-2 grow">
                        <p className="h-4 bg-slate-100 w-4/5"></p>
                        <p className="h-4 bg-slate-100 w-full"></p>
                        <p className="h-4 bg-slate-100 w-2/3"></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchItemCardTemplate