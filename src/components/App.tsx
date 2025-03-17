import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '../assets/router'

const App:React.FC = () => {
  return (
    <React.StrictMode>
        <RouterProvider router={router}>
        </RouterProvider>
    </React.StrictMode>
  )
}

export default App
