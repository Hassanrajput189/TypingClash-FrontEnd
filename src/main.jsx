import { StrictMode, useContext,useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import {createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Register from "./components/Register.jsx";
import { Toaster } from "react-hot-toast";
import ContextProvider from "./context/ContextProvidor.jsx"
import context from "./context/context.js";
import axios from "axios";
import { API_URL } from "./config.js";
const Routes = () => {
const { isLogedIn,setIsLogedIn,setUserName } = useContext(context);
  const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/me`, {
          withCredentials: true,
        });
        const success = response.data.success;
        if (success) {
          setIsLogedIn(true);
          setUserName(response.data.user.name); // get user name from login response
        }
      } catch (error) {
        setIsLogedIn(false);
      }
    };
    useEffect(() => {
      checkLoginStatus();
    }, []);
  
  const router = createBrowserRouter([
    {
      path: "/register", 
      element: <Register />,
    },
    {
      path: "/login", 
      element: <Login />,
    },
    {
      path: "/", 
      element: isLogedIn ? <App /> : <Navigate to="/login" replace />,
    },
  ]);
  return (
    <>
     <StrictMode>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
      </StrictMode>
    </>
  );
};

createRoot(document.getElementById("root")).render(
  
  <ContextProvider>
    <Routes />
  </ContextProvider>
);
