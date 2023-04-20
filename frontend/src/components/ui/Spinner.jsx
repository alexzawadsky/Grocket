import { useTranslation } from "react-i18next";
import SearchItemCardTemplate from "../../pages/Product/SearchItemCardTemplate";
import useScreen from "../../hooks/useScreen";
import cn from 'classnames'

const Spinner = ({ gap, type, count = 1, className }) => {

    const { t } = useTranslation()
    const { isMinTablet, isMinPC } = useScreen()
    let spinner

    switch (type) {
        case 'vcard':
            spinner = (
                <SearchItemCardTemplate horizontal={false} loader />
            )
            break
        case 'hcard':
            spinner = (
                <SearchItemCardTemplate horizontal loader />
            )
            break
        case 'promotion':
            spinner = (
                <div className="bg-slate-50/[.8] dark:bg-zinc-700/[.6] duration-75 animate-pulse p-5 rounded-xl grid gap-3">
                    <p className="h-8 bg-slate-100 dark:bg-zinc-700 w-7/12"></p>
                    <p className="bg-slate-100 dark:bg-zinc-700 h-20"></p>
                    <p className="h-8 w-5/12 bg-slate-100 dark:bg-zinc-700"></p>
                </div>
            )
            break
        case 'productPage':
            spinner = (
                <div className="grid gap-3 md:gap-7 lg:gap-10 md:grid-cols-[2fr_1fr] animate-pulse duration-75">
                    <div className="grid gap-2">
                        <p className="h-9 bg-slate-100 w-9/12 md:w-7/12 lg:w-5/12 dark:bg-zinc-700"></p>
                        <p className="bg-slate-100 dark:bg-zinc-700 h-6"></p>
                        {!isMinTablet && <p className="h-10 w-3/12 bg-slate-100 pt-5"></p>}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 gap-5">
                            <div className="aspect-[4/3] bg-slate-100 rounded-lg dark:bg-zinc-700"></div>
                            <div className="aspect-[4/3] bg-slate-100 rounded-lg dark:bg-zinc-700"></div>
                            {isMinTablet && <div className="aspect-[4/3] bg-slate-100 rounded-lg dark:bg-zinc-700"></div>}
                            {isMinPC && <div className="aspect-[4/3] bg-slate-100 rounded-lg dark:bg-zinc-700"></div>}
                        </div>
                        <p className="h-10 w-5/12 bg-slate-100 dark:bg-zinc-700 mt-5"></p>
                        <p className="bg-slate-100 dark:bg-zinc-700 h-40"></p>
                    </div>
                    {isMinTablet && <div className="grid gap-7 h-fit">
                        <p className="h-10 w-6/12 lg:w-3/12 bg-slate-100 hidden md:block dark:bg-zinc-700"></p>
                        <p className="h-32 w-11/12 lg:w-10/12 xl:w-8/12 rounded-lg bg-slate-100 dark:bg-zinc-700"></p>
                    </div>}
                </div>
            )
            break
        case 'profile':
            spinner = (
                <div className="grid gap-3 animate-pulse duartion-75 bg-slate-50/[.8] dark:bg-zinc-700/[.6] p-5 rounded-xl">
                    <p className="aspect-square rounded-full w-full bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-8 bg-slate-100 dark:bg-zinc-700 w-10/12 mt-2"></p>
                    <p className="h-6 bg-slate-100 dark:bg-zinc-700 w-8/12"></p>
                    <p className="h-6 bg-slate-100 dark:bg-zinc-700 w-7/12"></p>
                    <p className="h-6 bg-slate-100 dark:bg-zinc-700 w-9/12"></p>
                </div>
            )
            break
        case 'category':
            spinner = <div className="w-full h-10 rounded-lg animate-pulse duration-75 bg-slate-100 dark:bg-zinc-700"></div>
            break
        case 'comment':
            spinner = (
                <div className="rounded-lg bg-slate-50/[.8] dark:bg-zinc-700/[.6] animate-pulse duration-75 p-5 gap-2 grid">
                    <p className="h-6 w-7/12 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-3 bg-slate-100 dark:bg-zinc-700 w-3/12"></p>
                    <p className="h-3 bg-slate-100 dark:bg-zinc-700 w-3/12"></p>
                    <p className="h-3 bg-slate-100 dark:bg-zinc-700 w-6/12"></p>
                    <p className="bg-slate-100 dark:bg-zinc-700 h-28"></p>
                </div>
            )
            break
        case 'catlist':
            const wOptions = ['w-32', 'w-36', 'w-40', 'w-44', 'w-48', 'w-52', 'w-56', 'w-60', 'w-64', 'w-68', 'w-72']
            spinner = (
                <div className="animate-pulse duratin-75">
                    <p className={cn(
                        'bg-slate-100 dark:bg-zinc-700 h-10',
                        wOptions[Math.floor(Math.random() * wOptions.length)]
                    )}></p>
                    <ul className="grid gap-1 mt-2">
                        {Array(Math.floor(Math.random() * (8 - 0 + 1)) + 0).fill(0).map((_, key) =>
                            <li key={key} className={cn(
                                'bg-slate-100 dark:bg-zinc-700 h-6',
                                wOptions[Math.floor(Math.random() * wOptions.length)]
                            )}></li>)}
                    </ul>
                </div>
            )
            break
        default:
            spinner = (
                <span className={`flex items-center font-bold ${gap && 'pt-5 md:pl-5'}`}>
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                    {t('loading')}...
                </span>
            )
    }

    return <>
        {Array(count).fill(0).map((_, key) =>
            <span className={className} key={key} aria-hidden='true'>{spinner}</span>)}
    </>
}

export default Spinner