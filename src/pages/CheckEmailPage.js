import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function Component() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleOnchange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("clcked");
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, { email: email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log("response", response);
      toast.success(response?.data?.message);

      if (response.data.success) {
        navigate("/password", {
          state: response?.data.data,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

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
              <p className="text-gray-400 mt-2">Keep going </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-400"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleOnchange}
                  value={email}
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
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
  );
}
