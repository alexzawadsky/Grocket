import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import './i18n'
import { CategoriesListStateProvider } from './contexts/CategoriesListStateContext'

const queryClient = new QueryClient({
  defaultOptions: {

  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <CategoriesListStateProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </CategoriesListStateProvider>
  </HelmetProvider>
)
