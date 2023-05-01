import { useTranslation } from 'react-i18next'
import SearchItemCardTemplate from '../../pages/Product/SearchItemCardTemplate'
import useScreen from '../../hooks/useScreen'
import cn from 'classnames'

const Spinner = ({ gap, type, count = 1, className }) => {
    const { t } = useTranslation()
    const { isMinTablet, isMinPC } = useScreen()
    let spinner

    switch (type) {
        case 'vcard':
            spinner = <SearchItemCardTemplate horizontal={false} loader />
            break
        case 'hcard':
            spinner = <SearchItemCardTemplate horizontal loader />
            break
        case 'promotion':
            spinner = (
                <div className="grid animate-pulse gap-3 rounded-xl bg-slate-50/[.8] p-5 duration-75 dark:bg-zinc-700/[.6]">
                    <p className="h-8 w-7/12 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-20 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-8 w-5/12 bg-slate-100 dark:bg-zinc-700"></p>
                </div>
            )
            break
        case 'productPage':
            spinner = (
                <div className="grid animate-pulse gap-3 duration-75 md:grid-cols-[2fr_1fr] md:gap-7 lg:gap-10">
                    <div className="grid gap-2">
                        <p className="h-9 w-9/12 bg-slate-100 dark:bg-zinc-700 md:w-7/12 lg:w-5/12"></p>
                        <p className="h-6 bg-slate-100 dark:bg-zinc-700"></p>
                        {!isMinTablet && (
                            <p className="h-10 w-3/12 bg-slate-100 pt-5 dark:bg-zinc-700"></p>
                        )}
                        <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                            <div className="aspect-[4/3] rounded-lg bg-slate-100 dark:bg-zinc-700"></div>
                            <div className="aspect-[4/3] rounded-lg bg-slate-100 dark:bg-zinc-700"></div>
                            {isMinTablet && (
                                <div className="aspect-[4/3] rounded-lg bg-slate-100 dark:bg-zinc-700"></div>
                            )}
                            {isMinPC && (
                                <div className="aspect-[4/3] rounded-lg bg-slate-100 dark:bg-zinc-700"></div>
                            )}
                        </div>
                        <p className="mt-5 h-10 w-5/12 bg-slate-100 dark:bg-zinc-700"></p>
                        <p className="h-40 bg-slate-100 dark:bg-zinc-700"></p>
                    </div>
                    {isMinTablet && (
                        <div className="grid h-fit gap-7">
                            <p className="hidden h-10 w-6/12 bg-slate-100 dark:bg-zinc-700 md:block lg:w-3/12"></p>
                            <p className="h-32 w-11/12 rounded-lg bg-slate-100 dark:bg-zinc-700 lg:w-10/12 xl:w-8/12"></p>
                        </div>
                    )}
                </div>
            )
            break
        case 'profile':
            spinner = (
                <div className="duartion-75 grid animate-pulse gap-3 rounded-xl bg-slate-50/[.8] p-5 dark:bg-zinc-700/[.6]">
                    <p className="aspect-square w-full rounded-full bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="mt-2 h-8 w-10/12 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-6 w-8/12 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-6 w-7/12 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-6 w-9/12 bg-slate-100 dark:bg-zinc-700"></p>
                </div>
            )
            break
        case 'category':
            spinner = (
                <div className="h-7 w-full animate-pulse rounded-lg bg-slate-100 duration-75 dark:bg-zinc-700"></div>
            )
            break
        case 'comment':
            spinner = (
                <div className="grid animate-pulse gap-2 rounded-lg bg-slate-50/[.8] p-5 duration-75 dark:bg-zinc-700/[.6]">
                    <p className="h-6 w-7/12 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-3 w-3/12 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-3 w-3/12 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-3 w-6/12 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className="h-28 bg-slate-100 dark:bg-zinc-700"></p>
                </div>
            )
            break
        case 'catlist':
            const wOptions = [
                'w-32',
                'w-36',
                'w-40',
                'w-44',
                'w-48',
                'w-52',
                'w-56',
                'w-60',
                'w-64',
                'w-68',
                'w-72',
            ]
            spinner = (
                <div className="duratin-75 animate-pulse">
                    <p
                        className={cn(
                            'h-10 bg-slate-100 dark:bg-zinc-700',
                            wOptions[
                                Math.floor(Math.random() * wOptions.length)
                            ]
                        )}
                    ></p>
                    <ul className="mt-2 grid gap-1">
                        {Array(Math.floor(Math.random() * (8 - 0 + 1)) + 0)
                            .fill(0)
                            .map((_, key) => (
                                <li
                                    key={key}
                                    className={cn(
                                        'h-6 bg-slate-100 dark:bg-zinc-700',
                                        wOptions[
                                            Math.floor(
                                                Math.random() * wOptions.length
                                            )
                                        ]
                                    )}
                                ></li>
                            ))}
                    </ul>
                </div>
            )
            break
        default:
            spinner = (
                <span
                    className={`flex w-fit items-center font-bold ${
                        gap ? 'pt-5 md:pl-5' : ''
                    }`}
                >
                    <svg
                        aria-hidden="true"
                        role="status"
                        className="mr-3 inline h-4 w-4 animate-spin text-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                        />
                    </svg>
                    {t('loading')}...
                </span>
            )
    }

    return (
        <>
            {Array(count)
                .fill(0)
                .map((_, key) => (
                    <span className={className} key={key} aria-hidden="true">
                        {spinner}
                    </span>
                ))}
        </>
    )
}

export default Spinner
