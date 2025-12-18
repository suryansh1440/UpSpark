import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import router from './routes/router.jsx'

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
