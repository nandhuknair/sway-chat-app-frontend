import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from "../assets/sway-logo.png";
import io from 'socket.io-client'
import { useTheme } from '../context/ThemeContext'

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { darkMode } = useTheme()

  const fetchUserDetails = async() => {
    try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
        const response = await axios({
          url : URL,
          withCredentials : true
        })

        dispatch(setUser(response.data.data))

        if(response.data.data.logout){
            dispatch(logout())
            navigate("/email")
        }
    } catch (error) {
        console.log("error", error)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth : {
        token : localStorage.getItem('token')
      },
    })

    socketConnection.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return () => {
      socketConnection.disconnect()
    }
  }, [])

  const basePath = location.pathname === '/'

  return (
    <div className={`grid lg:grid-cols-[300px,1fr] h-screen max-h-screen ${darkMode ? 'dark' : ''}`}>
        <section className={`bg-white dark:bg-gray-800 ${!basePath && "hidden"} lg:block`}>
           <Sidebar/>
        </section>

        <section className={`${basePath && "hidden"} bg-gray-300 dark:bg-gray-700`} >
            <Outlet/>
        </section>

        <div className={`justify-center bg-gray-300 dark:bg-gray-700 items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
            <div>
              <img
                src={logo}
                width={250}
                alt='logo'
              />
            </div>
            <p className='text-lg mt-2 text-slate-500 dark:text-slate-400'>Select user to send message</p>
        </div>
    </div>
  )
}

export default Home