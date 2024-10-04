import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical, HiOutlineEmojiHappy } from "react-icons/hi"
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6"
import { IoClose } from "react-icons/io5"
import { IoMdSend } from "react-icons/io";
import uploadFile from '../helpers/uploadFile'
import Loading from './Loading'
import moment from 'moment'
import { useTheme } from '../context/ThemeContext'
import backgroundImage from '../assets/walpapper.jpg'
import EmojiPicker from 'emoji-picker-react'

const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  })
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  })
  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const currentMessage = useRef(null)
  const { darkMode } = useTheme()

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [allMessage])

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(prev => !prev)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage(prev => ({ ...prev, imageUrl: uploadPhoto.url }))
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage(prev => ({ ...prev, videoUrl: uploadPhoto.url }))
  }

  const handleClearUpload = (type) => {
    setMessage(prev => ({ ...prev, [type]: "" }))
  }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId)
      socketConnection.emit('seen', params.userId)
      socketConnection.on('message-user', (data) => {
        setDataUser(data)
      })
      socketConnection.on('message', (data) => {
        setAllMessage(data)
      })
    }
  }, [socketConnection, params?.userId, user])

  const handleOnChange = (e) => {
    const { value } = e.target
    setMessage(prev => ({ ...prev, text: value }))
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        })
        setMessage({ text: "", imageUrl: "", videoUrl: "" })
      }
    }
  }

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => ({ ...prev, text: prev.text + emojiObject.emoji }))
  }

  return (
    <div 
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover bg-center h-screen flex flex-col"
    >
      <header className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 shadow-md backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <FaAngleLeft size={25} />
            </Link>
            <div className="flex items-center gap-3">
              <Avatar
                width={50}
                height={50}
                imageUrl={dataUser?.profile_pic}
                name={dataUser?.name}
                userId={dataUser?._id}
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{dataUser?.name}</h3>
                <p className="text-sm">
                  {dataUser.online ? (
                    <span className="text-green-500">online</span>
                  ) : (
                    <span className="text-gray-400">offline</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <HiDotsVertical size={20} />
          </button>
        </div>
      </header>

      <section className="flex-grow overflow-y-auto px-4 py-6" ref={currentMessage}>
        <div className="flex flex-col gap-4">
          {allMessage.map((msg, index) => (
            <div
              key={index}
              className={`flex ${user._id === msg?.msgByUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg shadow-md max-w-[80%] ${
                  user._id === msg?.msgByUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                {msg?.imageUrl && (
                  <img src={msg?.imageUrl} alt="Shared image" className="w-full rounded-lg mb-2" />
                )}
                {msg?.videoUrl && (
                  <video src={msg.videoUrl} controls className="w-full rounded-lg mb-2" />
                )}
                <p className="break-words">{msg.text}</p>
                <p className="text-xs mt-1 opacity-75">
                  {moment(msg.createdAt).format('HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 shadow-lg backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(prev => !prev)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineEmojiHappy size={24} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={handleUploadImageVideoOpen}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <FaPlus size={20} />
              </button>
              {openImageVideoUpload && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                  <label
                    htmlFor="uploadImage"
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <FaImage className="text-green-500" />
                    <span className="dark:text-white">Image</span>
                  </label>
                  <label
                    htmlFor="uploadVideo"
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <FaVideo className="text-purple-500" />
                    <span className="dark:text-white">Video</span>
                  </label>
                </div>
              )}
              <input
                type="file"
                id="uploadImage"
                onChange={handleUploadImage}
                className="hidden"
                accept="image/*"
              />
              <input
                type="file"
                id="uploadVideo"
                onChange={handleUploadVideo}
                className="hidden"
                accept="video/*"
              />
            </div>

            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow py-2 px-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
              value={message.text}
              onChange={handleOnChange}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <IoMdSend size={20} />
            </button>
          </form>
        </div>
      </footer>

      {(message.imageUrl || message.videoUrl) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Preview</h3>
              <button
                onClick={() => handleClearUpload(message.imageUrl ? 'imageUrl' : 'videoUrl')}
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>
            {message.imageUrl && (
              <img src={message.imageUrl} alt="Upload preview" className="w-full rounded-lg" />
            )}
            {message.videoUrl && (
              <video src={message.videoUrl} controls className="w-full rounded-lg" />
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
    </div>
  )
}

export default MessagePage