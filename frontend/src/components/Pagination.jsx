import React from 'react'

const Pagination = ({ onNext, onPrev, pagesCount, currentPage, loadNTH }) => {
    return (
        <div className='flex gap-5 w-fit items-center'>
            <button className='button-outline-orange' disabled={true} onClick={onPrev}>Prev</button>
            <div className='grow flex gap-2'>
                {Array(pagesCount).fill(0).map((el, key) => <button key={key} className={`w-10 h-10 border-2 hover:border-accent-orange rounded-full ${key + 1 == currentPage ? 'font-bold' : null}`}>{key + 1}</button>)}
            </div>
            <button className='button-outline-orange' disabled={onNext} onClick={onNext}>Next</button>
        </div>
    )
}

export default Pagination