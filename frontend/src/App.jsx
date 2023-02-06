import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sell from './pages/Sell'
import Landing from './pages/Landing'
import MyProfile from './pages/Profile'
import MyReviews from './pages/MyReviews';
import Footer from './components/Footer'
import NotFound from './pages/NotFound';
import UserProfile from './pages/UserProfile';
import ReviewsPage from './pages/ReviewsPage';
import MyLots from './pages/MyLots';


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
                element: <MyProfile />,
                children: [
                    {
                        path: 'reviews',
                        element: <MyReviews />
                    },
                    {
                        path: 'lots',
                        element: <MyLots />
                    }
                ]
            },
            {
                path: "sell",
                element: <Sell />,
            },
            {
                path: 'user/:userId',
                element: <UserProfile />,
                children: [
                    {
                        path: 'reviews',
                        element: <ReviewsPage />
                    }
                ]
            }
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />
}

export default App
