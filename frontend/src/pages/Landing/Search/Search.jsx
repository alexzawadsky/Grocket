import React, { useState, useEffect, useContext } from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { BiCategoryAlt } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import FullCategoriesList from './FullCategoriesList'
import CategoriesListStateContext from '../../../contexts/CategoriesListStateContext'

const Search = () => {

    const { t } = useTranslation()
    const { open, setOpen } = useContext(CategoriesListStateContext)

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (categoriesListExpanded) {
    //             window.scrollTo(0, 0); // Disable scroll
    //         }
    //     };
    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, [categoriesListExpanded]);

    return (
        <div className='w-full'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-8 h-fit md:h-10 bg-white w-full'>
                <button
                    className='button-outline-orange h-10'
                    // className={`button-outline-orange h-10 ${open && '!border-b-0 !rounded-b-none'}`}
                    onClick={() => setOpen(!open)}
                >
                    <BiCategoryAlt />
                    {t('categories')}
                </button>
                <input placeholder='eg. Iphone 14 Pro Max 512Gb' className='flex-grow grocket-input h-full !rounded-full w-full' type="text" />
                <button className='button-fill-orange h-10 max-md:w-full max-md:justify-center'>
                    <HiMagnifyingGlass />
                    {t('search')}
                </button>
            </div>
            <div className={open && 'mt-3'}>
                <FullCategoriesList />
            </div>
        </div>
    )
}

export default Search