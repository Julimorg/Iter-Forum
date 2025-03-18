import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Welcome from "../pages/Welcome_Page/Welcome";
import Login from "../pages/Login_Page/Login";
import SignUp from "../pages/SignUp_Page/SignUp";
import Home from "../pages/Home_Page/Home";
import UserProfile from "../pages/Profile_Page/UserProfile";
import CreatePost from "../pages/CreatePost_Page/CreatePost";
import Popular from "../pages/Popular/Popular";
import Explore from "../pages/Explore_Page/Explore";
import PostDetail from "../pages/Post_Detail/post_detail";
// Config react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//! TUYỆT ĐỐI KHÔNG ĐƯỢC ADD STYLE VÀO ĐÂY
//! VÌ ĐÂY LÀ FILE ROUTES CHÍNH, NÓ CHỈ ĐỂ QUẢN LÝ CÁC ROUTES, KHÔNG ĐỂ QUẢN LÝ STYLE
//! ADD VÀO LÀ TAO CHÉM
//! --- Fong ---


//? Xác định route cần auth tài khoản thì mới truy cập vào Home
//? Outlet để hiện thị Child Route
const AuthorizedRoute = () => {
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;
  if (!user) return <Navigate to='/login' replace={true} />;
  return <Outlet />
}
const UnAuthorizedRoute = () => {
  const userInfo = localStorage.getItem('userInfo');
  const user = userInfo ? JSON.parse(userInfo) : null;
  if (user) return <Navigate to='/home' replace={true} />;
  return <Outlet />
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        {/* Unauthorize routes */}
        <Route element={<UnAuthorizedRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        {/* Authorize routes */}
        <Route element={<AuthorizedRoute />}>
          {/* Nested Routes in Home */}
          <Route path="/home" element={<Home />}>
            <Route path="profile" element={<UserProfile />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="popular" element={<Popular />} />
            <Route path="explore" element={<Explore />} />
            <Route path="post-detail" element={<PostDetail />} />
          </Route>
        </Route>
      </Routes >
      <ToastContainer position="bottom-left" theme="colored" />
    </>
  );
}

export default App;
