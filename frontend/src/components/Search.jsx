import React from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { BiCategoryAlt } from 'react-icons/bi'

const Search = () => {
    return (
        <div className='flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-8 h-fit md:h-10 bg-white w-full'>
            <button className='button-outline-orange h-10'>
                <BiCategoryAlt />
                Categories
            </button>
            <input placeholder='eg. Iphone 14 Pro Max 512Gb' className='flex-grow grocket-input h-full !rounded-full w-full' type="text" />
            <button className='button-fill-orange h-10 max-md:w-full max-md:justify-center'>
                <HiMagnifyingGlass />
                Search
            </button>
        </div>
    )
}

export default Search