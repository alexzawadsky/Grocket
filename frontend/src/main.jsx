import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import './i18n'
import { CategoriesListStateProvider } from './contexts/CategoriesListStateContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { SearchHistoryProvider } from './contexts/HistoryContext';
import { AuthProvider } from './contexts/AuthProvider';
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 0,
      retry: 1
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <SearchHistoryProvider>
        <HelmetProvider>
          <ThemeProvider>
            <CategoriesListStateProvider>
              <QueryClientProvider client={queryClient}>
                <App />
                <ReactQueryDevtools />
              </QueryClientProvider>
            </CategoriesListStateProvider>
          </ThemeProvider>
        </HelmetProvider>
      </SearchHistoryProvider>
    </AuthProvider>
  </BrowserRouter>
)
