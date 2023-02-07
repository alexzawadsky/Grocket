import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sell from './pages/Sell'
import Landing from './pages/Landing'
import MyProfile from './pages/Profile'
import MyComments from './pages/MyComments';
import Footer from './components/Footer'
import NotFound from './pages/NotFound';
import UserProfile, { userProfileLoader } from './pages/UserProfile';
import UserComments from './pages/UserComments';
import MyLots from './pages/MyLots';
import ProductPage, { productLoader } from './pages/ProductPage';
import UserLots, { userLotsLoader } from './pages/UserLots';


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
                        path: 'comments',
                        element: <MyComments />
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
                loader: userProfileLoader,
                element: <UserProfile />,
                children: [
                    {
                        path: '',
                        loader: userLotsLoader,
                        element: <UserLots />
                    },
                    {
                        path: 'comments',
                        element: <UserComments />
                    }
                ]
            },
            {
                path: 'product/:productId',
                loader: productLoader,
                element: <ProductPage />
            }
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />
}

export default App
