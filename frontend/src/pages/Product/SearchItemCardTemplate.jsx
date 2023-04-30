import { useTranslation } from 'react-i18next'
import cn from 'classnames'

const SearchItemCardTemplate = ({ horizontal, onFail, loader }) => {
    const { t } = useTranslation()

    if (!horizontal)
        return (
            <div
                className={cn(
                    'h-full md:p-5',
                    loader && 'animate-pulse duration-75'
                )}
                aria-hidden="true"
            >
                <div
                    className={cn(
                        'grid gap-1 rounded-xl bg-slate-50/[.8] dark:bg-zinc-700/[.6]',
                        onFail && 'border-2 border-accent-red'
                    )}
                >
                    <div className="aspect-[4/3] rounded-xl bg-slate-100 dark:bg-zinc-700"></div>
                    <div className="grid gap-2 p-4">
                        {onFail ? (
                            <p className="font-bold text-accent-red">
                                {t('product_fetch_fail')}
                            </p>
                        ) : (
                            <p className="h-6 bg-slate-100 dark:bg-zinc-700"></p>
                        )}
                        <p className="h-8 w-3/5 bg-slate-100 dark:bg-zinc-700"></p>
                        <p className="h-4 w-4/5 bg-slate-100 dark:bg-zinc-700"></p>
                        <p className="h-4 w-4/5 bg-slate-100 dark:bg-zinc-700"></p>
                        <p className="h-4 w-4/5 bg-slate-100 dark:bg-zinc-700"></p>
                    </div>
                </div>
            </div>
        )

    return (
        <div
            className={cn('p-5', loader && 'animate-pulse duration-75')}
            aria-hidden="true"
        >
            <div
                className={cn(
                    onFail && 'border-2 border-accent-red',
                    'grid grid-cols-[1fr_2fr] overflow-hidden rounded-2xl bg-slate-50/[.8] dark:bg-zinc-700/[.6] xl:grid-cols-[1fr_2fr_1fr]'
                )}
            >
                <div className="aspect-[4/3] bg-slate-100 dark:bg-zinc-700"></div>
                <div className="grid grid-rows-6 gap-1 p-4">
                    {onFail ? (
                        <p className="font-bold text-accent-red">
                            {t('product_fetch_fail')}
                        </p>
                    ) : (
                        <p className=" w-44 bg-slate-100 dark:bg-zinc-700"></p>
                    )}
                    <p className=" w-full bg-slate-100  dark:bg-zinc-700"></p>
                    <p className=" w-52 bg-slate-100  dark:bg-zinc-700"></p>
                    <p className=" w-44 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className=" w-44 bg-slate-100 dark:bg-zinc-700"></p>
                    <p className=" w-44 bg-slate-100 dark:bg-zinc-700"></p>
                </div>
                <div className="hidden h-full gap-4 px-4 py-7 text-sm xl:flex">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-zinc-700"></div>
                    <div className="grid h-fit grow gap-2">
                        <p className="h-4 w-4/5 bg-slate-100 dark:bg-zinc-700"></p>
                        <p className="h-4 w-full bg-slate-100 dark:bg-zinc-700"></p>
                        <p className="h-4 w-2/3 bg-slate-100 dark:bg-zinc-700"></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchItemCardTemplate
