import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Chat from './Chat'

const Messenger = () => {
    return (
        <div>
            <Routes>
                <Route path=":productId" element={<Chat />} />
                <Route path="" element={<p>no chat selected</p>} />
            </Routes>
        </div>
    )
}

export default Messenger
