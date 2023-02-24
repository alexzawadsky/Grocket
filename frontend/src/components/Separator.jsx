import React from "react";

const Separator = ({ vertical, horizontal, visible }) => {
    return (
        <span className={`${visible ? null : 'hidden'} border-zinc-400 my-3 mx-auto border-2 ${vertical ? 'h-full row-span-full' : null} ${horizontal ? 'w-full col-span-full' : null}`}></span>
    )
}

export default Separator