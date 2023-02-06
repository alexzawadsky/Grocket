import Navbar from './components/Navbar'
import { Routes, Route, Outlet } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sell from './pages/Sell'
import Landing from './pages/Landing'
import Profile from './pages/Profile'
import Footer from './components/Footer'
import NotFound from './pages/NotFound';

const PageIndex = () => {
    return (
        <div className='flex flex-col h-full'>
            <Navbar />
            <div className='mt-20 container mx-auto flex-grow px-5  '>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <PageIndex />,
        errorElement: <NotFound />,
        children: [
            {
                path: '',
                element: <Landing />
            },
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "sell",
                element: <Sell />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />
}

export default App
