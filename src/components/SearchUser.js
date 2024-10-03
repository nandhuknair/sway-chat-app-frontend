import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import { toast } from "sonner";
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import { useTheme } from '../context/ThemeContext'

const SearchUser = ({onClose}) => {
    const [searchUser, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const { darkMode } = useTheme()

    const handleSearchUser = async() => {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`
        try {
            setLoading(true)
            const response = await axios.post(URL, {
                search: search
            })
            setLoading(false)
            setSearchUser(response.data.data)
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    useEffect(() => {
        handleSearchUser()
    }, [search])

    return (
        <div className='fixed inset-0 bg-slate-700 bg-opacity-40 dark:bg-opacity-60 p-2 z-10'>
            <div className='w-full max-w-lg mx-auto mt-10'>
                <div className='bg-white dark:bg-gray-800 rounded h-14 overflow-hidden flex'>
                    <input 
                        type='text'
                        placeholder='Search user by name, email....'
                        className='w-full outline-none py-1 h-full px-4 dark:bg-gray-700 dark:text-white'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                    <div className='h-14 w-14 flex justify-center items-center text-gray-500 dark:text-gray-400'>
                        <IoSearchOutline size={25}/>
                    </div>
                </div>

                <div className='bg-white dark:bg-gray-800 mt-2 w-full p-4 rounded'>
                    {searchUser.length === 0 && !loading && (
                        <p className='text-center text-slate-500 dark:text-slate-400'>no user found!</p>
                    )}

                    {loading && (
                        <p><Loading/></p>
                    )}

                    {searchUser.length !== 0 && !loading && (
                        searchUser.map((user) => (
                            <UserSearchCard key={user._id} user={user} onClose={onClose}/>
                        ))
                    )}
                </div>
            </div>

            <div className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300' onClick={onClose}>
                <button>
                    <IoClose/>
                </button>
            </div>
        </div>
    )
}

export default SearchUser