import {
    Navbar,
    Footer,
    PrivateRoute,
    LanguageSelectionBanner,
} from './components'
import { WindowScroll } from './components/ui'
import { Routes, Route } from 'react-router-dom'
import {
    Landing,
    Login,
    Sell,
    UserProfile,
    NotFound,
    ProductPage,
    Register,
    SearchHistoryPage,
    EditProduct,
    Promote,
    Search,
    AboutSite,
    SpecialThanks,
    Messenger,
} from './pages'
import CategoriesListStateContext from './contexts/CategoriesListStateContext'
import { useContext } from 'react'
import { Toaster } from 'react-hot-toast'
import cn from 'classnames'

function App() {
    const { open } = useContext(CategoriesListStateContext)

    return (
        <div
            className={cn(
                'flex min-h-full flex-col',
                open ? 'max-h-full overflow-hidden' : ''
            )}
            aria-label="all site"
        >
            <Navbar />
            <Toaster />
            <main
                className="container relative mx-auto flex flex-grow flex-col gap-5 p-5"
                aria-label="main site content"
            >
                <LanguageSelectionBanner />
                <Routes>
                    <Route path="/" errorElement={<NotFound />}>
                        <Route path="" element={<Landing />} />
                        <Route path="search" element={<Search />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="history" element={<SearchHistoryPage />} />
                        <Route
                            path="products/:productId"
                            element={<ProductPage />}
                        />
                        <Route
                            path="users/:profileId/*"
                            element={<UserProfile />}
                        />
                        <Route path="about-site" element={<AboutSite />} />
                        <Route
                            path="special-thanks"
                            element={<SpecialThanks />}
                        />
                        <Route element={<PrivateRoute />}>
                            <Route path="sell" element={<Sell />} />
                            <Route
                                path="products/:productId/edit"
                                element={<EditProduct />}
                            />
                            <Route
                                path="products/:productId/promote"
                                element={<Promote />}
                            />
                            <Route path="messenger/*" element={<Messenger />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </main>
            <WindowScroll />
            <Footer />
        </div>
    )
}

export default App
