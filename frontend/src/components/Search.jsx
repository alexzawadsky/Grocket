import React from 'react'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import { BiCategoryAlt } from 'react-icons/bi'

const Search = () => {
    return (
        <div className='flex items-center gap-8 h-10 bg-white'>
            <button className='h-full flex items-center border-2 border-accent-orange rounded-xl px-5 gap-2 text-accent-orange hover:bg-accent-orange/[0.07]'>
                <BiCategoryAlt />
                Categories
            </button>
            <input placeholder='eg. Iphone 14 Pro Max 512Gb' className='flex-grow border-2 border-black rounded-full h-full px-6 text-lg focus:outline-none' type="text" />
            <button className='bg-accent-orange hover:bg-accent-orange/[0.8] h-full px-5 rounded-xl text-white flex items-center gap-2'>
                <HiMagnifyingGlass />
                Search
            </button>
        </div>
    )
}

export default Search