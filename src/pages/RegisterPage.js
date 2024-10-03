
import { useState } from "react"
import { IoCloseCircleOutline } from "react-icons/io5"
import { motion } from "framer-motion"
import { Link, Navigate, useNavigate } from "react-router-dom"
import uploadFile from '../helpers/uploadFile'
import axios from 'axios'
import { toast } from 'sonner'

export default function Component() {
  const [data, setData] = useState({
    name: "",
    password: "",
    email: "",
    profile_pic: "",
  })

  const navigate = useNavigate()
  
  const [uploadPhoto, setUploadPhoto] = useState("")

  const handleOnchange = (e) => {
    const { name, value } = e.target
    setData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleUploadPhoto = async(e) => {
    const file = e.target.files[0]
    const uploadPhoto = await uploadFile(file)
    console.log("uplaodPhoto",uploadPhoto)
    setUploadPhoto(file)

    setData((previous)=> {
      return {
        ...previous,
        profile_pic:uploadPhoto?.url
      }
    })

  }

  const clearUploadPhoto = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('clcked')
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

    try {
      const response = await axios.post(URL,data)
      console.log('response',response)
      toast.success(response?.data?.message)
      
      if(response.data.success){
        setData({
          name:"",
          email:"",
          password:"",
          profile_pic:""
        })
        navigate('/email') 
      }

    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log(error)
    }

    
  }

  return (
    <div className="min-h-screen flex justify-center bg-black text-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
                  Sway chat app
                </span>
              </h1>
              <p className="text-gray-400 mt-2">Create your account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleOnchange}
                  value={data.name}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleOnchange}
                  value={data.email}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleOnchange}
                  value={data.password}
                  required
                />
              </div>
              <div>
                <label htmlFor="profile_pic" className="block text-sm font-medium text-gray-400">
                  Profile Photo
                </label>
                <div
                  className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                  onClick={() => document.getElementById('profile_pic').click()}
                >
                  <div className="space-y-1 text-center">
                    {uploadPhoto ? (
                      <p className="text-sm text-gray-400">{uploadPhoto.name}</p>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-xs text-gray-400">Upload a file or drag and drop</p>
                      </>
                    )}
                  </div>
                  {uploadPhoto && (
                    <button onClick={clearUploadPhoto} className="ml-2">
                      <IoCloseCircleOutline className="text-xl text-gray-400 hover:text-gray-200" />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  id="profile_pic"
                  name="profile_pic"
                  className="sr-only"
                  onChange={handleUploadPhoto}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Register
                </button>
              </div>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to={"/email"}
                  className="font-medium text-blue-500 hover:text-blue-400 transition-colors duration-200"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}