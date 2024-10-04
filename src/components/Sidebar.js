import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5"
import { FaUserPlus } from "react-icons/fa"
import { NavLink, useNavigate } from 'react-router-dom'
import { BiLogOut } from "react-icons/bi"
import { FiSun, FiMoon } from "react-icons/fi"
import Avatar from './Avatar'
import { useDispatch, useSelector } from 'react-redux'
import EditUserDetails from './EditUserDetails'
import SearchUser from './SearchUser'
import { FaImage, FaVideo } from "react-icons/fa6"
import { FiArrowUpLeft } from "react-icons/fi"
import { logout } from '../redux/userSlice'
import { useTheme } from '../context/ThemeContext'

const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [allUser, setAllUser] = useState([])
    const [openSearchUser, setOpenSearchUser] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { darkMode, toggleDarkMode } = useTheme()

    useEffect(() => {
        if (socketConnection && user?._id) {
            socketConnection.emit('sidebar', user._id);
            
            socketConnection.on('conversation', (data) => {
                const conversationUserData = data.map((conversationUser) => {
                    // Check if sender and receiver IDs exist before accessing them
                    if (conversationUser?.sender && conversationUser?.receiver) {
                        return conversationUser.sender._id === conversationUser.receiver._id 
                            ? { ...conversationUser, userDetails: conversationUser.sender }
                            : { ...conversationUser, userDetails: conversationUser.receiver._id !== user._id ? conversationUser.receiver : conversationUser.sender }
                    }
                    return null; // Handle cases where sender or receiver is null
                }).filter(Boolean); // Filter out any null entries
                
                setAllUser(conversationUserData);
            });
        }
    }, [socketConnection, user]);
    

    const handleLogout = () => {
        dispatch(logout())
        navigate("/email")
        localStorage.clear()
    }

    return (
        <div className="flex h-full">
            <div className="w-16 bg-white dark:bg-gray-800 shadow-md flex flex-col justify-between py-6">
                <div className="space-y-4">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex justify-center items-center h-12 w-12 mx-auto rounded-xl transition-all duration-200 ease-in-out ${
                                isActive
                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                            }`
                        }
                        title="Chat"
                    >
                        <IoChatbubbleEllipses size={24} />
                    </NavLink>
                    <button
                        onClick={() => setOpenSearchUser(true)}
                        className="flex justify-center items-center h-12 w-12 mx-auto rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 ease-in-out"
                        title="Add friend"
                    >
                        <FaUserPlus size={24} />
                    </button>
                </div>
                <div className="space-y-4">
                    <button
                        onClick={() => setEditUserOpen(true)}
                        className="flex justify-center items-center mx-auto"
                        title={user?.name}
                    >
                        <Avatar
                            width={40}
                            height={40}
                            name={user?.name}
                            imageUrl={user?.profile_pic}
                            userId={user?._id}
                        />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex justify-center items-center h-12 w-12 mx-auto rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 ease-in-out"
                        title="Logout"
                    >
                        <BiLogOut size={24} />
                    </button>
                    <button
                        onClick={toggleDarkMode}
                        className="flex justify-center items-center h-12 w-12 mx-auto rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 ease-in-out"
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                    </button>
                </div>
            </div>
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                    {allUser.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            <FiArrowUpLeft size={50} className="mb-4" />
                            <p className="text-lg text-center">
                                Explore users to start a conversation with.
                            </p>
                        </div>
                    ) : (
                        allUser.map((conv) => (
                            <NavLink
                                to={`/${conv?.userDetails?._id}`}
                                key={conv?._id}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 py-4  px-6 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${
                                        isActive ? 'bg-blue-50 dark:bg-blue-900' : ''
                                    }`
                                }
                            >
                                <Avatar
                                    imageUrl={conv?.userDetails?.profile_pic}
                                    name={conv?.userDetails?.name}
                                    width={50}
                                    height={50}
                                />
                                <div className="flex-1 min-w-1">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {conv?.userDetails?.name}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        {conv?.lastMsg?.imageUrl && <FaImage className="mr-1" />}
                                        {conv?.lastMsg?.videoUrl && <FaVideo className="mr-1" />}
                                        <p className="truncate">
                                            {conv?.lastMsg?.text || (conv?.lastMsg?.imageUrl ? 'Image' : 'Video')}
                                        </p>
                                    </div>
                                </div>
                                {Boolean(conv?.unseenMsg) && (
                                    <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {conv?.unseenMsg}
                                    </span>
                                )}
                            </NavLink>
                        ))
                    )}
                </div>
            </div>
            {editUserOpen && (
                <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
            )}
            {openSearchUser && <SearchUser onClose={() => setOpenSearchUser(false)} />}
        </div>
    )
}

export default Sidebar