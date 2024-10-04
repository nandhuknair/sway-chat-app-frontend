import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/sway-logo.png";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import Cookies from "js-cookie";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token'); 
      console.log("this is the cookie token !!!!!!!!!!!!!!!!", token);
      if (!token) {
        navigate("/email");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/user-details`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.logout) {
          dispatch(logout());
          console.log("Token expired, logging out...");
          navigate("/email");
        } else {
          dispatch(setUser(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        if (error.response && error.response.status === 401) {
          dispatch(logout());
          navigate("/email");
        }
      }
    };

    fetchUserDetails();
  }, [dispatch, navigate]);

  const basePath = location.pathname === "/";

  return (
    <div
      className={`grid lg:grid-cols-[300px,1fr] h-screen max-h-screen ${
        darkMode ? "dark" : ""
      }`}
    >
      <section
        className={`bg-white dark:bg-gray-800 ${
          !basePath && "hidden"
        } lg:block`}
      >
        <Sidebar />
      </section>

      <section
        className={`${basePath && "hidden"} bg-gray-300 dark:bg-gray-700`}
      >
        <Outlet />
      </section>

      <div
        className={`justify-center bg-gray-300 dark:bg-gray-700 items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
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
