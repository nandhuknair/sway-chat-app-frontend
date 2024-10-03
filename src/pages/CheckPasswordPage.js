
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from "react-redux"
import { setToken, setUser } from '../redux/userSlice';
import Avatar from "../components/Avatar"


export default function Component() {

    const [data,setData] = useState({
      password : "",
      userId : ""
    })
 
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(()=>{
      if(!location?.state?.name){
        navigate('/email')
      }
    },[])
  
    const handleOnChange = (e)=>{
      const { name, value} = e.target
  
      setData((preve)=>{
        return{
            ...preve,
            [name] : value
        }
      })
    }
  

    const handleSubmit = async(e)=>{
      e.preventDefault()
      e.stopPropagation()
  
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`
  
      try {
          const response = await axios({
            method :'post',
            url : URL,
            data : {
              userId : location?.state?._id,
              password : data.password
            },
            withCredentials : true
          })
  
          toast.success(response.data.message)
  
          if(response.data.success){
              dispatch(setToken(response?.data?.token))
              localStorage.setItem('token',response?.data?.token)
              setData({
                password : "",
              })
              navigate('/')
          }
      } catch (error) {
          toast.error(error?.response?.data?.message)
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

          <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
                {/* <PiUserCircle
                  size={80}
                /> */}
                <Avatar
                  width={70}
                  height={70}
                  name={location?.state?.name}
                  imageUrl={location?.state?.profile_pic}
                />
                <h2 className='font-semibold text-lg mt-1'>{location?.state?.name}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Passord
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleOnChange}
                  value={data.password}
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                   Login
                </button>
              </div>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-center text-sm text-gray-400">
                New to sway ?{" "}
                <Link
                  to={"/register"}
                  className="font-medium text-blue-500 hover:text-blue-400 transition-colors duration-200"
                >
                  Register bruh !
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}