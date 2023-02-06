import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Sell from './pages/Sell'
import Main from './pages/Main'
import MyProfile from './pages/MyProfile'

function App() {

    return (
        <div className='flex flex-col h-full'>
            <Navbar />
            <div className='mt-20 border-2 border-primary-900 rounded-2xl container mx-auto flex-grow px-5  '>
                <Routes>
                    <Route path='/' element={<Main />} />
                    <Route path='/profile' element={<MyProfile />} />
                    <Route path='/sell' element={<Sell />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
