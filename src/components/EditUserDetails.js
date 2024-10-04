import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
import { useTheme } from '../context/ThemeContext'

const EditUserDetails = ({onClose, user}) => {
    const [data, setData] = useState({
        name: user?.name,
        profile_pic: user?.profile_pic
    })
    const uploadPhotoRef = useRef()
    const dispatch = useDispatch()
    const { darkMode } = useTheme()

    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                profile_pic: user.profile_pic
            });
        }
    }, [user]);

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOpenUploadPhoto = (e) => {
        e.preventDefault()
        e.stopPropagation()
        uploadPhotoRef.current.click()
    }

    const handleUploadPhoto = async(e) => {
        const file = e.target.files[0]
        const uploadPhoto = await uploadFile(file)
        setData(prev => ({
            ...prev,
            profile_pic: uploadPhoto?.url
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
    
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
            const response = await axios({
                method: 'post',
                url: URL,
                data: {
                    name: data.name,
                    profile_pic: data.profile_pic,
                },
                withCredentials: true,
            });
    
            if (response.data.success && response.data.data) {
                dispatch(setUser(response.data.data));  
                onClose();
            } else {
                throw new Error("Failed to update user details");
            }
    
            toast.success(response?.data?.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred");
        }
    };
  
    return (
        <div className='fixed inset-0 bg-gray-700 bg-opacity-40 dark:bg-opacity-60 flex justify-center items-center z-10'>
            <div className='bg-white dark:bg-gray-800 p-4 py-6 m-1 rounded w-full max-w-sm'>
                <h2 className='font-semibold dark:text-white'>Profile Details</h2>
                <p className='text-sm text-gray-600 dark:text-gray-400'>Edit user details</p>

                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='name' className='dark:text-white'>Name:</label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            value={data.name}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primary border-0.5 dark:bg-gray-700 dark:text-white dark:border-gray-600'
                        />
                    </div>

                    <div>
                        <div className='dark:text-white'>Photo:</div>
                        <div className='my-1 flex items-center gap-4'>
                            <Avatar
                                width={40}
                                height={40}
                                imageUrl={data?.profile_pic}
                                name={data?.name}
                            />
                            <label htmlFor='profile_pic'>
                                <button className='font-semibold dark:text-white' onClick={handleOpenUploadPhoto}>Change Photo</button>
                                <input
                                    type='file'
                                    id='profile_pic'
                                    className='hidden'
                                    onChange={handleUploadPhoto}
                                    ref={uploadPhotoRef}
                                />
                            </label>
                        </div>
                    </div>

                    <Divider/>    
                    <div className='flex gap-2 w-fit ml-auto'>
                        <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white'>Cancel</button>
                        <button onClick={handleSubmit} className='border-primary bg-primary text-black border px-4 py-1 rounded hover:bg-secondary dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-700'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default React.memo(EditUserDetails)