import { Navbar, Footer, PrivateRoute, LanguageSelectionBanner } from './components'
import { WindowScroll } from './components/ui';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { SearchHistoryProvider } from './contexts/HistoryContext';
import { AuthProvider } from './contexts/AuthProvider';
import {
    Landing,
    Login,
    Sell,
    UserProfile,
    UserComments,
    NotFound,
    UserProductsPage,
    ProductPage,
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
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast'

function App() {

    const { open } = useContext(CategoriesListStateContext)

    return (
        <BrowserRouter>
            <AuthProvider>
                <SearchHistoryProvider>
                    {/* <ReactQueryDevtools /> */}
                    <div className={`flex flex-col h-full ${open && 'overflow-hidden'}`}>
                        <Navbar />
                        <Toaster />
                        <main className='mt-20 container mx-auto flex-grow px-5 relative flex flex-col gap-5'>
                            <LanguageSelectionBanner />
                            <Routes>
                                <Route path='/' errorElement={<NotFound />}>
                                    <Route path='' element={<Landing />} />
                                    <Route path='search' element={<Search />} />
                                    <Route path='login' element={<Login />} />
                                    <Route path='register' element={<Register />} />
                                    <Route path='history' element={<SearchHistoryPage />} />
                                    <Route path='products/:productId' element={<ProductPage />} />
                                    <Route path='users/:profileId' element={<UserProfile />}>
                                        <Route path='settings' element={<ProfileSettings />}>
                                            <Route path='password' element={<PasswordReset />} />
                                            <Route path='avatar' element={<ChangeAvatar />} />
                                            <Route path='info' element={<UpdateProfile />} />
                                            <Route path='delete' element={<DeleteProfile />} />
                                        </Route>
                                        <Route path='items' element={<UserProductsPage />} />
                                        <Route path='comments' element={<UserComments />}>
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
                        <WindowScroll />
                        <Footer />
                    </div>
                </SearchHistoryProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
