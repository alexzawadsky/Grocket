import React, { useState, useEffect } from "react";

const Spinner = () => {

    const [dots, setDots] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            if (dots.length < 3) {
                setDots(dots + '.')
            } else {
                setDots('')
            }
        }, [200])
        return () => clearInterval(interval)
    })

    return (
        <span className="flex font-bold">
            <p>Loading</p>
            <p className="text-accent-orange min-w-[15px]">{dots}</p>
        </span>
    )
}

export default Spinner