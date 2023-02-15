import { Navbar, Footer, PrivateRoute } from './components'
import { Outlet } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SearchHistoryProvider } from './contexts/HistoryContext';
import { AuthProvider } from './contexts/AuthProvider';
import {
    Landing,
    Login,
    Sell,
    MyProfile,
    MyComments,
    NotFound,
    UserProfile,
    UserComments,
    MyLots,
    ProductPage,
    UserLots,
    MyFavourites,
    Register,
    PasswordReset,
    SearchHistoryPage
} from './pages'


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
                        element: <MyComments />
                    },
                    {
                        path: 'lots',
                        element: <MyLots />
                    },
                    {
                        path: 'favourites',
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
                element: <UserProfile />,
                children: [
                    {
                        path: 'lots',
                        element: <UserLots />
                    },
                    {
                        path: 'comments',
                        element: <UserComments />
                    }
                ]
            },
            {
                path: 'products/:productId',
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
