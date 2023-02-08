import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sell from './pages/Sell'
import Landing from './pages/Landing'
import MyProfile from './pages/MyProfile'
import MyComments, { commentsLoader } from './pages/MyComments';
import Footer from './components/Footer'
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
import { Context } from './contexts/Context';
import useLocalStorage from './hooks/useLocalStorage';


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
            }
        ],
    },
]);

function App() {

    const [lookHistory, setLookHistory] = useLocalStorage('lookHistory', [])

    const updateHistory = (product) => {
        if (lookHistory.filter((el) => el.id === product.id).length > 0) return
        setLookHistory([...lookHistory, product])
    }

    const clearHistory = () => {
        setLookHistory([])
    }

    return (
        <Context.Provider
            value={{
                lookHistory,
                updateHistory,
                clearHistory
            }}
        >
            <RouterProvider router={router} />
        </Context.Provider>

    )
}

export default App
