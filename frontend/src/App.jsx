import { Navbar, Footer, PrivateRoute } from './components'
import { Outlet, Routes, Route, BrowserRouter } from 'react-router-dom'
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
    SearchHistoryPage,
    Sold,
    Archieved,
    ProfileSettings,
    ChangeAvatar,
    UpdateProfile,
    DeleteProfile,
    EditProduct
} from './pages'


function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SearchHistoryProvider>
                    <div className='flex flex-col h-full'>
                        <Navbar />
                        <main className='mt-20 container mx-auto flex-grow px-5'>
                            <Routes>
                                <Route path='/' errorElement={<NotFound />}>
                                    <Route path='' element={<Landing />} />
                                    <Route path='login' element={<Login />} />
                                    <Route path='register' element={<Register />} />
                                    <Route path='history' element={<SearchHistoryPage />} />
                                    <Route path='users/:userId' element={<UserProfile />}>
                                        <Route path='lots' element={<UserLots />} />
                                        <Route path='comments' element={<UserComments />} />
                                    </Route>
                                    <Route path='products/:productId' element={<ProductPage />} />
                                    <Route element={<PrivateRoute />}>
                                        <Route path='profile' element={<MyProfile />}>
                                            <Route path='settings' element={<ProfileSettings />}>
                                                <Route path='password' element={<PasswordReset />} />
                                                <Route path='avatar' element={<ChangeAvatar />} />
                                                <Route path='info' element={<UpdateProfile />} />
                                                <Route path='delete' element={<DeleteProfile />} />
                                            </Route>
                                            <Route path='lots' element={<MyLots />} />
                                            <Route path='favourites' element={<MyFavourites />} />
                                            <Route path='archive' element={<Archieved />} />
                                            <Route path='sold' element={<Sold />} />
                                            <Route path='comments' element={<MyComments />} />
                                        </Route>
                                        <Route path='sell' element={<Sell />} />
                                    </Route>
                                    <Route path='*' element={<NotFound />} />
                                </Route>
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </SearchHistoryProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
