import { Navbar, Footer, PrivateRoute, LanguageSelectionBanner, WindowScroll } from './components'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { SearchHistoryProvider } from './contexts/HistoryContext';
import { AuthProvider } from './contexts/AuthProvider';
import {
    Landing,
    Login,
    Sell,
    MyProfile,
    MyComments,
    NotFound,
    MyLots,
    ProductPage,
    MyFavourites,
    Register,
    PasswordReset,
    SearchHistoryPage,
    ProfileSettings,
    ChangeAvatar,
    UpdateProfile,
    DeleteProfile,
    EditProduct,
    Promote,
    AddComment,
    Search
} from './pages'
import CategoriesListStateContext from './contexts/CategoriesListStateContext';
import { useContext } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {

    const { open } = useContext(CategoriesListStateContext)

    return (
        <BrowserRouter>
            <AuthProvider>
                <SearchHistoryProvider>
                    {/* <ReactQueryDevtools /> */}
                    <WindowScroll />
                    <div className={`flex flex-col h-full ${open && 'overflow-hidden'}`}>
                        <Navbar />
                        <main className='mt-20 container mx-auto flex-grow px-5 relative'>
                            <LanguageSelectionBanner />
                            <Routes>
                                <Route path='/' errorElement={<NotFound />}>
                                    <Route path='' element={<Landing />} />
                                    <Route path='search' element={<Search />} />
                                    <Route path='login' element={<Login />} />
                                    <Route path='register' element={<Register />} />
                                    <Route path='history' element={<SearchHistoryPage />} />
                                    <Route path='products/:productId' element={<ProductPage />} />
                                    <Route path='users/:profileId' element={<MyProfile />}>
                                        <Route path='settings' element={<ProfileSettings />}>
                                            <Route path='password' element={<PasswordReset />} />
                                            <Route path='avatar' element={<ChangeAvatar />} />
                                            <Route path='info' element={<UpdateProfile />} />
                                            <Route path='delete' element={<DeleteProfile />} />
                                        </Route>
                                        <Route path='lots' element={<MyLots />} />
                                        <Route path='favourites' element={<MyFavourites />} />
                                        <Route path='comments' element={<MyComments />}>
                                            <Route path='add' element={<AddComment />} />
                                        </Route>
                                    </Route>
                                    <Route element={<PrivateRoute />}>
                                        <Route path='sell' element={<Sell />} />
                                        <Route path='products/:productId/edit' element={<EditProduct />} />
                                        <Route path='products/:productId/promote' element={<Promote />} />
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
