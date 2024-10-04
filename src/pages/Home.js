import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from '../assets/sway-logo.png';
import io from 'socket.io-client';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/email');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user-details`, {
          withCredentials: true,
        });

        if (response.data.logout) {
          dispatch(logout());
          localStorage.removeItem('token');
          navigate('/email');
        } else {
          dispatch(setUser(response.data.data));
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        if (error.response && error.response.status === 401) {
          dispatch(logout());
          localStorage.removeItem('token');
          navigate('/email');
        }
      } finally {
        console.log('completed')
      }
    };

    fetchUserDetails();
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
    });

    setSocket(newSocket);
    dispatch(setSocketConnection(newSocket));

    return () => {
      newSocket.disconnect();
    };
  }, [dispatch]);

  const basePath = location.pathname === '/';

  return (
    <div
      className={`grid lg:grid-cols-[300px,1fr] h-screen max-h-screen ${
        darkMode ? 'dark' : ''
      }`}
    >
      <section
        className={`bg-white dark:bg-gray-800 ${
          !basePath && 'hidden'
        } lg:block`}
      >
        <Sidebar />
      </section>

      <section
        className={`${basePath && 'hidden'} bg-gray-300 dark:bg-gray-700`}
      >
        <Outlet />
      </section>

      <div
        className={`justify-center bg-gray-300 dark:bg-gray-700 items-center flex-col gap-2 hidden ${
          !basePath ? 'hidden' : 'lg:flex'
        }`}
      >
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500 dark:text-slate-400">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;