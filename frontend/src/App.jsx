import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sell from './pages/Sell'
import Landing from './pages/Landing'
import MyProfile from './pages/MyProfile'
import MyComments, { commentsLoader } from './pages/MyComments';
import NotFound from './pages/NotFound';
import UserProfile, { userProfileLoader } from './pages/UserProfile';
import UserComments from './pages/UserComments';
import MyLots from './pages/MyLots';
import ProductPage, { productLoader } from './pages/ProductPage';
import UserLots, { userLotsLoader } from './pages/UserLots';
import MyFavourites, { favouritesLoader } from './pages/MyFavourites';
import Login from './pages/Login';
import Register from './pages/Register';
import Reset from './pages/Reset';
import SearchHistoryPage from './pages/SearchHistoryPage';
import { SearchHistoryProvider } from './contexts/HistoryContext';
import { AuthProvider } from './contexts/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import PasswordReset from './pages/PasswordReset';


const PageIndex = () => {
    return (
        <AuthProvider>
            <div className='flex flex-col h-full'>
                <Navbar />
                <div className='mt-20 container mx-auto flex-grow px-5'>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </AuthProvider>
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
                element: <PrivateRoute element={<MyProfile />} />,
                children: [
                    {
                        path: 'comments',
                        loader: commentsLoader,
                        element: <MyComments />
                    },
                    {
                        path: 'lots',
                        element: <MyLots />
                    },
                    {
                        path: 'favourites',
                        loader: favouritesLoader,
                        element: <MyFavourites />
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
                        path: 'lots',
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
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'reset',
                element: <Reset />
            },
            {
                path: 'history',
                element: <SearchHistoryPage />
            },
            {
                path: 'password-reset',
                element: <PasswordReset />
            }
        ],
    },
]);

function App() {
    return (
        <SearchHistoryProvider>
            <RouterProvider router={router} />
        </SearchHistoryProvider>
    )
}

export default App
