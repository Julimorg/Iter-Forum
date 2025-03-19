import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Welcome from "../pages/Welcome_Page/Welcome";
import Login from "../pages/Login_Page/Login";
import SignUp from "../pages/SignUp_Page/SignUp";
import Home from "../pages/Home_Page/Home";
import UserProfile from "../pages/Profile_Page/UserProfile";
import CreatePost from "../pages/CreatePost_Page/CreatePost";
import Popular from "../pages/Popular/Popular";
import Explore from "../pages/Explore_Page/Explore";
import PostDetail from "../pages/Post_Detail/post_detail";
import TagDetail from "../pages/Tag_Detail/tag_detail";


//! TUYỆT ĐỐI KHÔNG ĐƯỢC ADD STYLE VÀO ĐÂY
//! VÌ ĐÂY LÀ FILE ROUTES CHÍNH, NÓ CHỈ ĐỂ QUẢN LÝ CÁC ROUTES, KHÔNG ĐỂ QUẢN LÝ STYLE
//! ADD VÀO LÀ TAO CHÉM
//! --- Fong ---
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Nested Routes in Home */}
        <Route path="/home" element={<Home />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="popular" element={<Popular />} />
          <Route path="explore" element={<Explore />} />
          <Route path="post-detail" element={<PostDetail />} />
          <Route path="/home/tag/:tagName" element={<TagDetail />} /> {/* Đường dẫn chung */}
        </Route>
      </Routes >
    </>
  );
}

export default App;
