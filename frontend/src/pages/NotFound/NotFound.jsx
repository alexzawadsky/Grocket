import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

const NotFound = () => {

    const { t } = useTranslation()

    return (
        <div className='w-full h-full text-center items-center flex justify-center flex-col gap-10 container mx-auto p-5'>
            <h1 className='font-bolditalic text-3xl'>{t('404_text')}</h1>
            <NavLink className='bg-accent-orange p-3 text-white font-bold px-5 rounded-lg hover:bg-accent-orange/[0.8]' to='/'>{t('back_to_mainpage')}</NavLink>
        </div>
    )
}

export default NotFound