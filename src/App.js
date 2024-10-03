
import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import "./index.css"
import { Toaster } from 'sonner'
import { ThemeProvider } from './context/ThemeContext';

function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) 

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <main>
        <Spinner />
      </main>
    )
  }

  return (
    <>
    <ThemeProvider>
    <Toaster position="bottom-left" />
    <main>
      <Outlet />
    </main>
    </ThemeProvider>
    </>
  )
}