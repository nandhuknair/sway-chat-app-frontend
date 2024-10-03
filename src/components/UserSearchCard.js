import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const UserSearchCard = ({user, onClose}) => {
  const { darkMode } = useTheme()

  return (
    <Link to={"/"+user?._id} onClick={onClose} className='flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 dark:border-b-slate-700 hover:border hover:border-primary dark:hover:border-blue-500 rounded cursor-pointer text-black dark:text-white'>
        <div>
            <Avatar
                width={50}
                height={50}
                name={user?.name}
                userId={user?._id}
                imageUrl={user?.profile_pic}
            />
        </div>
        <div>
            <div className='font-semibold text-ellipsis line-clamp-1'>
                {user?.name}
            </div>
            <p className='text-sm text-ellipsis line-clamp-1 text-gray-600 dark:text-gray-400'>{user?.email}</p>
        </div>
    </Link>
  )
}

export default UserSearchCard