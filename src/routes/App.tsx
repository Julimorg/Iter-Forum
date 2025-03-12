import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Welcome from "../pages/Welcome_Page/Welcome";
import Login from "../pages/Login_Page/Login";
import SignUp from "../pages/SignUp_Page/SignUp";
import Home from "../pages/Home_Page/Home";
import UserProfile from "../pages/Profile_Page/UserProfile";
import CreatePost from "../pages/CreatePost_Page/CreatePost";
import Popular from "../pages/Popular/Popular"; // Trang Popular
import Explore from "../pages/Explore/Explore";   // Trang Explore
import PostDetail from "../pages/Post_Detail/post_detail"; // Trang PostDetail
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header_HomePage/Header";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />

      {/* Layout cho các trang thuộc /home */}
      <Route
        path="/home"
        element={
          <div style={{ position: "relative" }}>
            {/* Header cố định ở đầu */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
              }}
            >
              <Header />
            </div>
            {/* Container chính có khoảng cách phía trên Header */}
            <div style={{ display: "flex", marginTop: "4rem" }}>
              {/* Sidebar với width: 20vw, nhưng có min-width và max-width */}
              <div style={{ flex: "0 0 20vw", minWidth: "250px", maxWidth: "300px" }}>
                <Sidebar />
              </div>
              {/* Nội dung chính */}
              <div style={{ flex: 1, padding: "1rem" }}>
                <Outlet />
              </div>
            </div>
          </div>
        }
      >
        <Route index element={<Home />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="popular" element={<Popular />} />
        <Route path="explore" element={<Explore />} />
        <Route path="post-detail" element={<PostDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
